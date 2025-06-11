const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createStory, getAllStories, deleteStory, EditStory} = require("../controllers/AdminStoryController");
const verifyToken = require("../middlewares/adminAuthMiddleware");

// multer config to store files in memory (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin post success stories with media upload support
router.post("/admin/write/stories", verifyToken, upload.single("media"), createStory);

// Admin get all stories
router.get("/admin/view/stories", verifyToken, getAllStories);

// Admin delete story by id
router.delete("/admin/delete/story/:id", verifyToken, deleteStory);

// Admin edit story
router.put("/admin/edit/story/:id", verifyToken, upload.single("media"), EditStory);

module.exports = router;
