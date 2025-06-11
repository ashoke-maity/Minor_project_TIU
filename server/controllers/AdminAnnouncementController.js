const dotenv = require("dotenv").config();
const Announcement = require("../models/AdminAnnouncementModel");

// create announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const newAnnouncement = new Announcement({ title, content });
    await newAnnouncement.save();
    return res
      .status(201)
      .json({
        message: "Announcement created successfully",
        announcement: newAnnouncement,
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return res.status(200).json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    return res.status(200).json({
      message: "Announcement updated successfully",
      announcement: updatedAnnouncement,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    return res.status(200).json({
      message: "Announcement deleted successfully",
      announcement: deletedAnnouncement,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};