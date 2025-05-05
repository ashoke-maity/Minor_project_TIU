const express = require('express');
const router = express.Router();
const { fetchUserData, fetchAllUsers, adminDeleteUser, adminUpdateUser } = require('../controllers/fetchUserDataController');
const verifyAdminToken = require('../middlewares/adminAuthMiddleware');

// Fetch a specific user by ID
router.get("/user/:userID", verifyAdminToken, fetchUserData);

// Fetch all users
router.get("/users", verifyAdminToken, fetchAllUsers);

// admin delete user
router.post("/delete/user", verifyAdminToken, adminDeleteUser);

// admin updates user
router.post("/update/user", verifyAdminToken, adminUpdateUser);

module.exports = router;
