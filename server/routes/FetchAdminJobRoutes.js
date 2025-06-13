// routes/PublicRoutes.js
const express = require("express");
const router = express.Router();
const getAllAdminJobsPublic = require("../controllers/FetchAdminJobsController");
const verifyUserToken = require("../middlewares/userAuthMiddleware");

// Public route for users to fetch jobs
router.get("/view/admin/jobs", verifyUserToken, getAllAdminJobsPublic);

module.exports = router;
