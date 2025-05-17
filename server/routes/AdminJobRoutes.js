const express = require("express");
const router = express.Router();
const {
  postJobByAdmin,
  deleteJobByAdmin,
  getJobsPostedByAdmin,
} = require("../controllers/AdminJobController");

const verifyToken = require("../middlewares/adminAuthMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// POST job by admin (with image upload)
router.post("/admin/jobs", verifyToken, upload.single("logo"), postJobByAdmin);

// GET all jobs posted by admin
router.get("/admin/jobs", verifyToken, getJobsPostedByAdmin);

// DELETE job by id
router.delete("/admin/jobs/:id", verifyToken, deleteJobByAdmin);

module.exports = router;
