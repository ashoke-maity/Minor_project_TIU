const express = require('express');
const router = express.Router();
const { fetchUserData, fetchAllUsers } = require('../controllers/fetchUserDataController');
const verifyAdminToken = require('../middlewares/adminAuthMiddleware');

// Fetch a specific user by ID
router.get("/user/:userID", verifyAdminToken, fetchUserData);

// Fetch all users
router.get("/users", verifyAdminToken, fetchAllUsers);

module.exports = router;
