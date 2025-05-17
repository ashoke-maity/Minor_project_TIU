// routes/PublicRoutes.js
const express = require("express");
const router = express.Router();
const { getAllAdminJobsPublic } = require("../controllers/FetchAdminJobsController");

// Public route for users to fetch jobs
router.get("/jobs", getAllAdminJobsPublic);

module.exports = router;
