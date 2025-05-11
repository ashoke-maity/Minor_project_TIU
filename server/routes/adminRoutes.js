const express = require('express');
const router = express.Router();
const { adminLogin, adminRegistration, adminDashboard, changeAdminPassword, forgotAdminPassword, resetAdminPassword } = require('../controllers/adminController');
const verifyToken = require('../middlewares/adminAuthMiddleware'); // your middleware

// login
router.post("/admin/login", adminLogin);

// register
router.post("/admin/register", adminRegistration)

// admin dashboard (profile section)
router.get("/admin/dashboard", verifyToken, adminDashboard);

// admin pass-change
router.put("/admin/change-password", verifyToken, changeAdminPassword);

// admin forgot pass
router.post("/admin/forgot-password", forgotAdminPassword);

// admin reset password
router.post("/admin/reset-password/:token", resetAdminPassword);


module.exports = router;