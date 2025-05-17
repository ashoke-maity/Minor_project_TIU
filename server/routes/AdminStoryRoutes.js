const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createStory, getAllStories } = require("../controllers/AdminStoryController");
const verifyToken = require("../middlewares/adminAuthMiddleware");

// multer config to store files in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin post success stories with media upload support
router.post("/admin/write/stories", verifyToken, upload.single("media"), createStory);

// Admin get all stories
router.get("/admin/view/stories", verifyToken, getAllStories);

module.exports = router;
