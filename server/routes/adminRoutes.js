const express = require('express');
const router = express.Router();
const { adminLogin, adminRegistration, adminDashboard } = require('../controllers/adminController');
const verifyToken = require('../middlewares/adminAuthMiddleware'); // your middleware

// login
router.post("/admin/login", adminLogin);

// register
router.post("/admin/register", adminRegistration)

// admin dashboard (profile section)
router.get("/admin/dashboard", verifyToken, adminDashboard);

module.exports = router;