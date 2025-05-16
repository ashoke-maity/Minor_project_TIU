const express = require("express");
const router = express.Router();
const { createStory, getAllStories } = require("../controllers/AdminStoryController");
const verifyToken = require('../middlewares/adminAuthMiddleware'); // your middleware

// admin post success stories
router.post("/admin/write/stories", verifyToken ,createStory);

// admin can see the story posted by the admin (track how many stories have been posted)
router.get("/admin/view/stories", verifyToken ,getAllStories);

module.exports = router;
