const express = require("express");
const router = express.Router();
const {
  userLogin,
  userDashboard,
  userDelete,
  userGoogleSignIn,
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

module.exports = router;