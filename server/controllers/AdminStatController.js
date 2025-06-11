const mongoose = require("mongoose");
const userDatabase = require("../models/userModel");
const adminDatabase = require("../models/adminModel");
const adminJobSchema = require("../models/AdminJobModel");
const eventSchema = require("../models/AdminEventModel");
const storySchema = require("../models/AdminStoryModel");
const userPostSchema = require("../models/UserPostModel");

// total number of users
const getNumberOfUsers = async (req, res) => {
  try {
    const userCount = await userDatabase.countDocuments();
    const adminCount = await adminDatabase.countDocuments();
    return res.status(200).json({
      message: "User and Admin counts fetched successfully",
      userCount: userCount,
      adminCount: adminCount,
    });
  } catch (error) {
    console.log("Error fetching user count", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// total number if jobs posted by admin and users
const TotalNumberOfJobsPosted = async (req, res) => {
  try {
    const jobCount = await adminJobSchema.countDocuments();
    return res.status(200).json({
      message: "Job count fetched successfully",
      jobCount: jobCount,
    });
  } catch (error) {
    console.log("Error fetching job count", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// total number of events posted by admin and users
const TotalNumberOfEventsPosted = async (req, res) => {
  try {
    const eventCount = await eventSchema.countDocuments();
    return res.status(200).json({
      message: "Event count fetched successfully",
      eventCount: eventCount,
    });
  } catch (error) {
    console.log("Error fetching event count", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// total number of stories posted by admin
const TotalNumberOfStoriesPosted = async (req, res) => {
  try {
    const storyCount = await storySchema.countDocuments();
    return res.status(200).json({
      message: "Story count fetched successfully",
      storyCount: storyCount,
    });
  } catch (error) {
    console.log("Error fetching story count", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// user activity for everything login registration, job posting, event posting, story posting
const userActivity = async (req, res) => {
  try {
    const userActivities = await userPostSchema.find().populate("userId", "name email");
    return res.status(200).json({
      message: "User activity fetched successfully",
      userActivities: userActivities,
    });
  } catch (error) {
    console.log("Error fetching user activity", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getNumberOfUsers,
  TotalNumberOfJobsPosted,
  TotalNumberOfEventsPosted,
  TotalNumberOfStoriesPosted,
  userActivity,
};
