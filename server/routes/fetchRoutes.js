const express = require('express');
const router = express.Router();
const fetchUserData = require('../controllers/fetchUserDataController');
const verifyAdminToken = require('../middlewares/adminAuthMiddleware');

// fetching the user data by admin
router.get("/user/:userID", verifyAdminToken, fetchUserData);

module.exports = router;