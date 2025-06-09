const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile-images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  }
});

const {
  userLogin,
  userDashboard,
  userDelete,
  userGoogleSignIn,
  getAllUsersExceptCurrent,
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  getPendingFollowRequests,
  getFollowers,
  getFollowing,
  removeFollower,
  unfollowUser,
  getUserProfile,
  getConnectionStatus,
  updateUserProfile,
} = require("../controllers/userController");
const verifyUserToken = require("../middlewares/userAuthMiddleware");

// login
router.post("/user/login", userLogin);

// Google Sign-In
router.post("/user/google-signin", userGoogleSignIn);

// user dashboard (profile section)
router.get("/user/dashboard", verifyUserToken, userDashboard);

// self delete
router.delete("/user/delete", verifyUserToken, userDelete);

// user can see other users account
router.get("/all-users", verifyUserToken, getAllUsersExceptCurrent);

// send follow request
router.post("/follow-request", verifyUserToken, sendFollowRequest);

// send accept request
router.post("/accept-follow", verifyUserToken, acceptFollowRequest);

// reject a request
router.post("/reject-request", verifyUserToken, rejectFollowRequest)

// get all the pending request
router.get("/all-request", verifyUserToken, getPendingFollowRequests);

// fetch followers
router.get("/followers", verifyUserToken, getFollowers);

// fetch following
router.get("/following", verifyUserToken, getFollowing);

// remove follower
router.post("/remove-follower", verifyUserToken, removeFollower);

//  unfollow user
router.post("/unfollow", verifyUserToken, unfollowUser);

// get user profile
router.get("/user/:userId", verifyUserToken, getUserProfile);

// get connection status
router.get("/connection-status/:userId", verifyUserToken, getConnectionStatus);

// update user profile
router.put("/user/profile/update", verifyUserToken, upload.single("profileImage"), updateUserProfile);

module.exports = router;