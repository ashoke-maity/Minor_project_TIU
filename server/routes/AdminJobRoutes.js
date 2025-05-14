const express = require("express");
const router = express.Router();
const { postJobByAdmin, deleteJobByAdmin } = require("../controllers/AdminJobController");
const verifyToken = require('../middlewares/adminAuthMiddleware'); // your middleware

// job posting by admin
router.post("/admin/jobs", verifyToken, postJobByAdmin);

// job deleting by admin
router.delete("/admin/jobs/:id", verifyToken, deleteJobByAdmin);

module.exports = router;
