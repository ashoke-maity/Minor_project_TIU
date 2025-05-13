const dotenv = require("dotenv").config();
const adminDatabase = require("../models/adminModel");
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
    const rawPassword = generateComplexPassword(); // ~14 chars

    // 2. Hash the password before storing
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 3. Save to DB
    const adminEntity = {
      FirstName,
      LastName,
      Email,
      Password: hashedPassword,
    };
    const admin = new adminDatabase(adminEntity);
    const adminData = await admin.save();

    // 4. Send credentials email with raw password
    await sendAdminCredentials({
      to: Email,
      name: `${FirstName} ${LastName}`,
      adminID: adminData.AdminID,
      password: rawPassword, // plaintext password sent via email only
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

// change password
const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.admin.id; // assuming `req.admin` is populated via middleware
    const { currentPassword, newPassword } = req.body;

    const admin = await adminDatabase.findById(adminId);
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.Password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.Password = hashedPassword;
    await admin.save();

    res.status(200).json({ msg: "Password updated successfully" });
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



module.exports = {
  adminLogin,
  adminRegistration,
  adminDashboard,
  changeAdminPassword,
  forgotAdminPassword,
  resetAdminPassword
};
