const dotenv = require("dotenv").config();
const userDatabase = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Notification = require("../models/notification");

// user login
const userLogin = async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    return res.status(400).json({ status: 0, msg: "Email required" });
  }

  try {
    const user = await userDatabase.findOne({ Email });

    if (!user) {
      return res.status(404).json({ status: 0, msg: "User not found" });
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
      .json({ status: 1, msg: "login successful", token: jwtToken });
  } catch (error) {
    console.error("Sign-In Error:", error);
    res.status(500).json({ status: 0, msg: "authentication failed" });
  }
};

// fetch all users (networking)
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
    console.log("req.user:", req.user); // Logged in user info
    console.log("req.body:", req.body); // Should contain targetUserId

  const senderId = req.user?.id;
  const { targetUserId } = req.body;

  if (!targetUserId) {
    return res.status(400).json({ status: 0, msg: "Target user ID is required" });
  }

  if (senderId === targetUserId) {
    return res.status(400).json({ status: 0, msg: "You cannot follow yourself" });
  }
console.log("Sender ID:", senderId);
console.log("Target User ID:", targetUserId);

  try {
    const sender = await userDatabase.findById(senderId);
    const targetUser = await userDatabase.findById(targetUserId);

    if (!sender || !targetUser) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }

    console.log("Checking if already sent follow request:", targetUser.FollowRequests.includes(senderId));
console.log("Checking if already a follower:", targetUser.Followers.includes(senderId));

    if (targetUser.FollowRequests.includes(senderId)) {
      return res.status(400).json({ status: 0, msg: "Follow request already sent" });
    }

    if (targetUser.Followers.includes(senderId)) {
      return res.status(400).json({ status: 0, msg: "You already follow this user" });
    }

    // Add follow request
    targetUser.FollowRequests.push(senderId);
    await targetUser.save();

    // ✅ Create a notification
    await Notification.create({
      recipient: targetUserId,
      sender: senderId,
      type: "follow-request",
      message: `${sender.FirstName} ${sender.LastName} sent you a follow request`,
    });

    return res.status(200).json({ status: 1, msg: "Follow request sent" });
  } catch (err) {
    console.error("Send Follow Request Error:", err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }

  console.log("FollowRequests:", targetUser.FollowRequests);
console.log("Followers:", targetUser.Followers);
};


// accept follow request
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
      recipient: requesterId,
      sender: receiverId,
      type: "follow",
      message: `${receiver.FirstName} ${receiver.LastName} accepted your follow request`,
    });

    res.status(200).json({ status: 1, msg: "Follow request accepted" });
  } catch (err) {
    console.error("Accept Follow Request Error:", err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// reject follow request
const rejectFollowRequest = async (req, res) => {
  const receiverId = req.user?.id;
  const { requesterId } = req.body;

  if (!requesterId) {
    return res.status(400).json({ status: 0, msg: "Requester ID is required" });
  }

  try {
    const receiver = await userDatabase.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ status: 0, msg: "Receiver not found" });
    }

    const requestIndex = receiver.FollowRequests.indexOf(requesterId);
    if (requestIndex === -1) {
      return res
        .status(400)
        .json({ status: 0, msg: "No follow request to reject" });
    }

    receiver.FollowRequests.splice(requestIndex, 1); // Remove request
    await receiver.save();

    await Notification.create({
      recipient: requesterId,
      sender: receiverId,
      type: "follow-rejected",
      message: `${receiver.FirstName} ${receiver.LastName} rejected your follow request`,
    });

    res.status(200).json({ status: 1, msg: "Follow request rejected" });
  } catch (err) {
    console.error("Reject Follow Request Error:", err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// previous requests
const getPendingFollowRequests = async (req, res) => {
  try {
    const user = await userDatabase
      .findById(req.user?.id)
      .populate("FollowRequests", "FirstName LastName Email");

    if (!user) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }

    res.status(200).json({ status: 1, followRequests: user.FollowRequests });
  } catch (err) {
    console.error("Get Pending Follow Requests Error:", err);
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
  rejectFollowRequest,
  getPendingFollowRequests,
};
