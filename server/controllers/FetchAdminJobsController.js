const mongoose = require("mongoose");
const AdminJob = require("../models/AdminJobModel");

const getAllAdminJobsPublic = async (req, res) => {
  try {
    const jobs = await AdminJob.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 1, jobs });
  } catch (err) {
    res.status(500).json({ status: 0, msg: "Server error", error: err.message });
  }
};

module.exports = getAllAdminJobsPublic;
