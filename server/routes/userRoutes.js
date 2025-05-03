const express = require('express');
const router = express.Router();
const { userLogin, userRegister, userDashboard } = require('../controllers/userController');
const verifyUserToken = require('../middlewares/userAuthMiddleware');

// login
router.post("/login", userLogin);

// register
router.post("/register", userRegister);

// user dashboard (profile section)
router.post("/dashboard", verifyUserToken, userDashboard);

module.exports = router;