const express = require("express");
const router = express.Router();
const {
  adminLogin,
  adminRegistration,
  adminDashboard,
  changeAdminPassword,
  forgotAdminPassword,
  resetAdminPassword,
  adminProfileUpdate,
  deleteAdminProfileImage,
} = require("../controllers/adminController");
const verifyToken = require("../middlewares/adminAuthMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// login
router.post("/admin/login", adminLogin);

// register
router.post("/admin/register", adminRegistration);

// admin dashboard (profile section)
router.get("/admin/dashboard", verifyToken, adminDashboard);

// admin pass-change
router.put(
  "/admin/change-password",
  verifyToken,
  upload.single("profilePic"),
  changeAdminPassword
);

// admin forgot pass
router.post("/admin/forgot-password", forgotAdminPassword);

// admin reset password
router.post("/admin/reset-password/:token", resetAdminPassword);

// admin profile update
router.put(
  "/admin/update-profile",
  verifyToken,
  upload.single("profilePic"),
  adminProfileUpdate
);

// admin deletion profile image
router.delete("/admin/profile-image", verifyToken, deleteAdminProfileImage);

module.exports = router;
