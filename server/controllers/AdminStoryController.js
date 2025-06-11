const Story = require("../models/AdminStoryModel");
const cloudinary = require("../config/cloudinary");

const createStory = async (req, res) => {
  try {
    const { title, author, storyBody, tags } = req.body;
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    let mediaUrl = null;
    let mediaPublicId = null;
    let mediaResourceType = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "stories",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      mediaUrl = uploadResult.secure_url;
      mediaPublicId = uploadResult.public_id;
      mediaResourceType = uploadResult.resource_type;
    }
    const newStory = new Story({
      title,
      author,
      storyBody,
      tags: parsedTags,
      mediaUrl,
      mediaPublicId,
      mediaResourceType,
    });
    const savedStory = await newStory.save();
    res.status(201).json({
      message: "Story submitted successfully!",
      story: savedStory,
    });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Failed to submit story", error });
  }
};

// Get all stories
const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Failed to fetch stories", error });
  }
};

const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    // Delete media from Cloudinary if present
    if (story.mediaPublicId) {
      try {
        await cloudinary.uploader.destroy(story.mediaPublicId, {
          resource_type: story.mediaResourceType || "image",
        });
      } catch (err) {
        console.warn("Failed to delete media from Cloudinary:", err.message);
      }
    }
    await story.deleteOne();
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Failed to delete story", error });
  }
};

// edit story
const EditStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, storyBody, tags } = req.body;
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    let mediaUrl = null;
    let mediaPublicId = null;
    let mediaResourceType = null;
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    // If a new media file is uploaded, delete the old one from Cloudinary
    if (req.file) {
      if (story.mediaPublicId) {
        try {
          await cloudinary.uploader.destroy(story.mediaPublicId, {
            resource_type: story.mediaResourceType || "image",
          });
        } catch (err) {
          console.warn("Failed to delete old media from Cloudinary:", err.message);
        }
      }
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "stories",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      mediaUrl = uploadResult.secure_url;
      mediaPublicId = uploadResult.public_id;
      mediaResourceType = uploadResult.resource_type;
    }
    const updateFields = {
      title,
      author,
      storyBody,
      tags: parsedTags,
    };
    if (mediaUrl) {
      updateFields.mediaUrl = mediaUrl;
      updateFields.mediaPublicId = mediaPublicId;
      updateFields.mediaResourceType = mediaResourceType;
    }
    const updatedStory = await Story.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );
    if (!updatedStory) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.status(200).json({
      message: "Story updated successfully!",
      story: updatedStory,
    });
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ message: "Failed to update story", error });
  }
};

module.exports = { createStory, getAllStories, deleteStory, EditStory};
