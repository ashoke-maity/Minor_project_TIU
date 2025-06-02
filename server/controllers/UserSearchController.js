const mongoose = require("mongoose");
const User = require("../models/userModel");
const userPostSchema = require("../models/UserPostModel");
const adminJobSchema = require("../models/AdminJobModel");
const eventSchema = require("../models/AdminEventModel");
const storySchema = require("../models/AdminStoryModel");

const UserSearchController = {
    async combinedSearch(req, res) {
    try {
      const { query } = req.query;
      const regex = new RegExp(query, "i");

      const users = await User.find({
        $or: [
          { FirstName: regex },
          { LastName: regex },
          { Email: regex }
        ],
      });

      const posts = await userPostSchema.find({
        $or: [
          { title: regex },
          { content: regex },
          { caption: regex } // add this if your posts use 'caption'
        ],
      });

      res.status(200).json({ users, posts });
    } catch (error) {
      console.error("Error in combined search:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  
  async searchUsers(req, res) {
    try {
      const { query } = req.query;
      const regex = new RegExp(query, "i"); // Case-insensitive search

      const users = await User.find({
        $or: [
          { FirstName: regex },
          { LastName: regex },
          { Email: regex }
        ],
      });

      res.status(200).json(users);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async searchPosts(req, res) {
    try {
      const { query } = req.query;
      const regex = new RegExp(query, "i");

      const posts = await userPostSchema.find({
        $or: [{ title: regex }, { content: regex }, { tags: regex }, { caption: regex }],
      });

      res.status(200).json(posts);
    } catch (error) {
      console.error("Error searching posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async searchJobs(req, res) {
    try {
      const { query } = req.query;
      const regex = new RegExp(query, "i");

      const jobs = await adminJobSchema.find({
        $or: [
          { title: regex },
          { company: regex },
          { location: regex },
          { description: regex },
        ],
      });

      res.status(200).json(jobs);
    } catch (error) {
      console.error("Error searching jobs:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async searchEvents(req, res) {
    try {
      const { query } = req.query;
      const regex = new RegExp(query, "i");

      const events = await eventSchema.find({
        $or: [{ title: regex }, { description: regex }, { location: regex }],
      });

      res.status(200).json(events);
    } catch (error) {
      console.error("Error searching events:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async searchStories(req, res) {
    try {
      const { query } = req.query;
      const regex = new RegExp(query, "i");

      const stories = await storySchema.find({
        $or: [{ title: regex }, { content: regex }, { location: regex }],
      });

      res.status(200).json(stories);
    } catch (error) {
      console.error("Error searching stories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = UserSearchController;
