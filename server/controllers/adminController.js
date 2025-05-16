const dotenv = require("dotenv").config();
const adminDatabase = require("../models/adminModel");
const cloudinary = require("../config/cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendAdminCredentials, sendAdminResetLink} = require("../utils/emailService");
const generateComplexPassword = require('../utils/passwordGenerator');

// login
const adminLogin = async (req, res) => {
  try {
    const { AdminID, Password } = req.body;
    const admin = await adminDatabase.findOne({ AdminID });

    if (!admin) {
      return res.status(404).json({
        msg: "Admin not found !",
      });
    }

    const isMatch = await bcrypt.compare(Password, admin.Password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: admin._id, Role: admin.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.log("something went wrong !");
  }
};

// register
const adminRegistration = async (req, res) => {
  try {
    const { FirstName, LastName, Email } = req.body;
    // 1. Generate a strong one-time password
    const rawPassword = generateComplexPassword();
    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    // 3. Prepare admin entity
    const adminEntity = {
      FirstName,
      LastName,
      Email,
      Password: hashedPassword,
    };
    // 4. Save admin to DB
    const admin = new adminDatabase(adminEntity);
    const adminData = await admin.save();
    // 5. Send credentials email
    await sendAdminCredentials({
      to: Email,
      name: `${FirstName} ${LastName}`,
      adminID: adminData.AdminID,
      password: rawPassword,
    });
    res.send({
      msg: "Admin registered successfully and one-time password sent via email.",
      adminData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Registration failed." });
  }
};

// admin dashboard
const adminDashboard = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ status: 0, msg: "Unauthorized access" });
    }

    res.status(200).json({
      status: 1,
      msg: `Welcome, ${req.admin.FirstName} ${req.admin.LastName}`,
      admin: req.admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// change admin password
const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { currentPassword, newPassword } = req.body;
    const file = req.file; // multer puts the file here

    const admin = await adminDatabase.findById(adminId);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.Password);
    if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

    // If a file is uploaded
    if (file) {
      try {
        // Convert buffer to base64 string and prepare data URI for Cloudinary
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        const uploadRes = await cloudinary.uploader.upload(dataUri, {
          folder: "admin_profiles",
          public_id: `${admin.AdminID}_profile`,
          overwrite: true,
        });
        admin.ProfileImage = uploadRes.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error:", uploadErr);
        return res.status(500).json({ msg: "Image upload failed" });
      }
    }

    // Update password
    if (newPassword) {
      admin.Password = await bcrypt.hash(newPassword, 10);
    }
    await admin.save();
    res.status(200).json({ msg: "Password and profile image updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// password forgot
const forgotAdminPassword = async (req, res) => {
  try {
const Email = req.body.email || req.body.Email;
    // 1. Check if admin with this email exists
    const admin = await adminDatabase.findOne({ Email });
    if (!admin) {
      return res
        .status(404)
        .json({ msg: "Admin with this email does not exist" });
    }

    // 2. Create a secure reset token (valid for 15 mins)
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // 3. Create reset link
    const resetLink = `${process.env.CLIENT_ROUTE}/admin/reset-password/${token}`;

    // 4. Send email with reset link
    await sendAdminResetLink({
      to: Email,
      name: `${admin.FirstName} ${admin.LastName}`,
      resetLink,
    });

    res.status(200).json({ msg: "Reset link sent to email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ msg: "Failed to send reset link" });
  }
};

// reset Password on the mail link
const resetAdminPassword = async (req, res) => {
  try {
    const { token } = req.params; // token from the URL
    const { newPassword } = req.body;

    // 1. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Find admin by decoded id
    const admin = await adminDatabase.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // 3. Validate new password length
    if (newPassword.length < 8) {
      return res.status(400).json({ msg: "Password must be at least 8 characters long." });
    }

    // 4. Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.Password = hashedPassword;
    await admin.save();

    res.status(200).json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ msg: "Reset link expired. Please try again." });
    }

    res.status(500).json({ msg: "Failed to reset password" });
  }
};

// admin profile-update
const adminProfileUpdate = async (req, res) => {
  try {
    const adminId = req.admin.id; // assuming you have admin from auth middleware
    const { FirstName, LastName } = req.body;
    const file = req.file; // multer file

    // Find admin in DB
    const admin = await adminDatabase.findById(adminId);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // Update fields
    if (FirstName) admin.FirstName = FirstName;
    if (LastName) admin.LastName = LastName;

    // Handle profile image upload if file provided
    if (file) {
      try {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const uploadRes = await cloudinary.uploader.upload(dataUri, {
          folder: "admin_profiles",
          public_id: `${admin.AdminID}_profile`,
          overwrite: true,
        });
        admin.ProfileImage = uploadRes.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error:", uploadErr);
        return res.status(500).json({ msg: "Image upload failed" });
      }
    }

    await admin.save();

    res.status(200).json({
      msg: "Profile updated successfully",
      admin: {
        FirstName: admin.FirstName,
        LastName: admin.LastName,
        ProfileImage: admin.ProfileImage,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ msg: "Failed to update profile." });
  }
};

// profile image deletion
const deleteAdminProfileImage = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const admin = await adminDatabase.findById(adminId);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    const publicId = `admin_profiles/${admin.AdminID}_profile`;

    // Call Cloudinary to delete the image
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
      // "not found" means image already doesn't exist, so still can continue
      return res.status(500).json({ msg: "Failed to delete image from Cloudinary" });
    }

    // Remove profile image URL from admin in DB
    admin.ProfileImage = null;
    await admin.save();

    res.status(200).json({ msg: "Profile image deleted successfully" });
  } catch (error) {
    console.error("Delete profile image error:", error);
    res.status(500).json({ msg: "Failed to delete profile image" });
  }
};


module.exports = {
  adminLogin,
  adminRegistration,
  adminDashboard,
  changeAdminPassword,
  forgotAdminPassword,
  resetAdminPassword,
  adminProfileUpdate,
  deleteAdminProfileImage,
};
