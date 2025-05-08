const express = require('express');
const router = express.Router();
const { userLogin, userRegister, userDashboard, userDelete, userUpdate, userForgotPassword, userResetPassword} = require('../controllers/userController');
const verifyUserToken = require('../middlewares/userAuthMiddleware');

// login
router.post("/user/login", userLogin);

// Forgot password route
router.post("/forgot-password", userForgotPassword);

// Reset password route
router.post("/reset-password", userResetPassword);

// register
router.post("/user/register", userRegister);

// user dashboard (profile section)
router.get("/user/dashboard", verifyUserToken, userDashboard);

// self delete
router.delete("/user/delete", verifyUserToken, userDelete);

// self update password
router.put("/user/update", verifyUserToken, userUpdate);

module.exports = router;