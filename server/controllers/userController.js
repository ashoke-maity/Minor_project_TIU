const crypto = require("crypto");
const userDatabase = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const postmark = require("postmark");
const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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


// google signIn api
const userGoogleSignIn = async (req, res) => {
  const { tokenId } = req.body;

  if (!tokenId) {
    return res.status(400).json({ status: 0, msg: "Token ID is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    // Check if user exists
    let user = await userDatabase.findOne({ Email: email });

    if (!user) {
      // Register the user if not already present
      user = new userDatabase({
        FirstName: given_name,
        LastName: family_name,
        Email: email,
        isGoogleUser: true, // ✅ Add this flag
        Password: "",        // Avoid setting null; use empty string to satisfy Mongoose
        PassoutYear: "",     // Prompt user later to fill this in
        Role: "user",
      });

      await user.save();
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        Role: user.Role,
        FirstName: user.FirstName,
        LastName: user.LastName,
        PassoutYear: user.PassoutYear,
        Email: user.Email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ status: 1, msg: "Google login successful", token: jwtToken });

  } catch (error) {
    console.error("Google Sign-In Error:", error);
    res.status(500).json({ status: 0, msg: "Google authentication failed" });
  }
};

module.exports = {
  userLogin,
  userDashboard,
  userDelete,
  userGoogleSignIn,
};