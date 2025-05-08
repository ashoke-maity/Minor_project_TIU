const crypto = require("crypto");
const userDatabase = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const postmark = require("postmark");
const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
// const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();

// user login
const userLogin = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res
      .status(400)
      .json({ status: 0, msg: "Email and password required" });
  }

  try {
    const user = await userDatabase.findOne({ Email });

    if (!user) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ status: 0, msg: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        Role: user.Role,
        FirstName: user.FirstName,
        LastName: user.LastName,
        PassoutYear: user.PassoutYear,
        Email: user.Email,
      }, // dynamic role in case it's extended
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ status: 1, msg: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// user forgot password
const userForgotPassword = async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    return res.status(400).json({ status: 0, msg: "Email is required" });
  }

  try {
    const user = await userDatabase.findOne({ Email });

    if (!user) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }

    // Create a reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Set token expiration (e.g., 1 hour)
    const resetTokenExpiration = Date.now() + 3600000;

    // Save token and expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiration;
    await user.save();

    const resetURL = `${process.env.CLIENT_ROUTE}/resetpass?token=${resetToken}`;

    // Send email via Postmark
    await postmarkClient.sendEmail({
      From: process.env.EMAIL_FROM,
      To: process.env.EMAIL_FROM, // ✅ This should be the user's email, not yours
      Subject: "Password Reset - AlumniConnect",
      HtmlBody: `<p>Click <a href="${resetURL}">here</a> to reset your password.</p>
                 <p>If you didn't request this, you can ignore this email.</p>`,
      TextBody: `Click this link to reset your password: ${resetURL}`,
      MessageStream: "outbound",
    });

    res.status(200).json({ status: 1, msg: "Password reset email sent" });

  } catch (error) {
    console.error("Postmark error:", error);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// password reset
const userResetPassword = async (req, res) => {
  const { resetToken, newPassword, confirmNewPassword } = req.body;

  if (!resetToken || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ status: 0, msg: "All fields are required" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ status: 0, msg: "Passwords do not match" });
  }

  try {
    // Look for the user by reset token and check if the token hasn't expired
    const user = await userDatabase.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }, // token should be greater than the current date (i.e., valid)
    });

    if (!user) {
      return res.status(400).json({ status: 0, msg: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and remove reset token
    user.Password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ status: 1, msg: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// user register
const userRegister = async (req, res) => {
  const {
    FirstName,
    LastName,
    PassoutYear,
    Email,
    Password,
    ConfirmedPassword,
  } = req.body;

  if (
    !FirstName ||
    !LastName ||
    !PassoutYear ||
    !Email ||
    !Password ||
    !ConfirmedPassword
  ) {
    return res.status(400).json({ status: 0, msg: "All fields are required" });
  }

  if (Password !== ConfirmedPassword) {
    return res.status(400).json({ status: 0, msg: "Passwords do not match" });
  }

  try {
    const existingUser = await userDatabase.findOne({ Email });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: 0, msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const userEntity = {
      FirstName,
      LastName,
      PassoutYear,
      Email,
      Password: hashedPassword,
      Role: "user",
    };

    const user = new userDatabase(userEntity);
    const registerData = await user.save();

    res
      .status(200)
      .json({ status: 1, msg: "Registration successful", registerData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// User dashboard (user profile section)
const userDashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 0, msg: "Unauthorized access" });
    }

    res.status(200).json({
      status: 1,
      msg: "Welcome to the user dashboard",
      user: req.user, // The user object will now contain all the user details
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// user delete (self-delete)
const userDelete = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: 0, msg: "Unauthorized access" });
    }

    const deletedUser = await userDatabase.findOneAndDelete({
      Email: req.user.Email,
    });

    if (!deletedUser) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }

    res.status(200).json({ status: 1, msg: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// user password update
const userUpdate = async (req, res) => {
  try {
    if (!req.user || !req.user.Email) {
      return res.status(401).json({ status: 0, msg: "Unauthorized access" });
    }

    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({ status: 0, msg: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ status: 0, msg: "New passwords do not match" });
    }

    const user = await userDatabase.findOne({ Email: req.user.Email });

    if (!user) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.Password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: 0, msg: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.Password = hashedPassword;
    await user.save();

    res.status(200).json({ status: 1, msg: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

module.exports = {
  userLogin,
  userRegister,
  userDashboard,
  userDelete,
  userUpdate,
  userForgotPassword,
  userResetPassword,
};