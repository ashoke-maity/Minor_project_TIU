const express = require('express');
const router = express.Router();
const { adminLogin, adminRegistration, adminDashboard } = require('../controllers/adminController');
const verifyToken = require('../middlewares/adminAuthMiddleware'); // your middleware

// login
router.post("/login", adminLogin);

// register
router.post("/register", adminRegistration)

// admin dashboard (profile section)
router.get("/dashboard", verifyToken, adminDashboard);

module.exports = router;