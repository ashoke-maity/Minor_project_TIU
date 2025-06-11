const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/AdminAnnouncementController");

const verifyToken = require('../middlewares/adminAuthMiddleware');

router.post("/admin/create-announcement", verifyToken, createAnnouncement);
router.get("/admin/get-announcements", verifyToken, getAnnouncements);
router.put("/admin/update-announcement/:id", verifyToken, updateAnnouncement);
router.delete("/admin/delete-announcement/:id", verifyToken, deleteAnnouncement);

module.exports = router;