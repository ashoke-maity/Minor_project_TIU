const express = require("express");
const router = express.Router();
const {
  userLogin,
  userDashboard,
  userDelete,
  userGoogleSignIn,
  getAllUsersExceptCurrent,
  getUserNotifications,
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  getPendingFollowRequests,
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

module.exports = router;