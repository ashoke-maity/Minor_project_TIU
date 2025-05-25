const crypto = require("crypto");
const userDatabase = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const postmark = require("postmark");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Notification = require("../models/notification");
// const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

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
        Password: "", // Avoid setting null; use empty string to satisfy Mongoose
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
        Email: user.Email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ status: 1, msg: "Google login successful", token: jwtToken });
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    res.status(500).json({ status: 0, msg: "Google authentication failed" });
  }
};

const getAllUsersExceptCurrent = async (req, res) => {
  try {
    const currentUserId = req.user?.id;

    const users = await userDatabase.find(
      { _id: { $ne: currentUserId } }, // exclude current user
      "FirstName LastName Email _id" // return only selected fields
    );

    res.status(200).json({ status: 1, users });
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// send a follow request to another user
const sendFollowRequest = async (req, res) => {
  const senderId = req.user?.id; // logged-in user
  const { targetUserId } = req.body; // the one to whom the request is being sent

  if (!targetUserId) {
    return res
      .status(400)
      .json({ status: 0, msg: "Target user ID is required" });
  }

  if (senderId === targetUserId) {
    return res
      .status(400)
      .json({ status: 0, msg: "You cannot follow yourself" });
  }

  try {
    const sender = await userDatabase.findById(senderId);
    const targetUser = await userDatabase.findById(targetUserId);

    if (!sender || !targetUser) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }

    if (targetUser.FollowRequests.includes(senderId)) {
      return res
        .status(400)
        .json({ status: 0, msg: "Follow request already sent" });
    }

    if (targetUser.Followers.includes(senderId)) {
      return res
        .status(400)
        .json({ status: 0, msg: "You already follow this user" });
    }

    targetUser.FollowRequests.push(senderId);
    await targetUser.save();

    return res.status(200).json({ status: 1, msg: "Follow request sent" });
  } catch (err) {
    console.error("Send Follow Request Error:", err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

const acceptFollowRequest = async (req, res) => {
  const receiverId = req.user?.id;
  const { requesterId } = req.body;

  if (!requesterId) {
    return res.status(400).json({ status: 0, msg: "Requester ID is required" });
  }

  try {
    const receiver = await userDatabase.findById(receiverId);
    const requester = await userDatabase.findById(requesterId);

    if (!receiver || !requester) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }

    const requestIndex = receiver.FollowRequests.indexOf(requesterId);
    if (requestIndex === -1) {
      return res
        .status(400)
        .json({ status: 0, msg: "No follow request found" });
    }

    // Move from FollowRequests to Followers/Following
    receiver.FollowRequests.splice(requestIndex, 1);
    receiver.Followers.push(requesterId);
    requester.Following.push(receiverId);

    await receiver.save();
    await requester.save();
    await Notification.create({
      recipient: requesterId, // the one who sent the follow request
      sender: receiverId, // the one who accepted
      type: "follow",
      message: `${receiver.FirstName} ${receiver.LastName} accepted your follow request`,
    });

    res.status(200).json({ status: 1, msg: "Follow request accepted" });
  } catch (err) {
    console.error("Accept Follow Request Error:", err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

module.exports = {
  userLogin,
  userDashboard,
  userDelete,
  userGoogleSignIn,
  getAllUsersExceptCurrent,
  sendFollowRequest,
  acceptFollowRequest,
};
