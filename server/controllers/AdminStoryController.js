const Story = require("../models/AdminStoryModel");
const cloudinary = require("../config/cloudinary");

const createStory = async (req, res) => {
  try {
    const { title, author, storyBody, tags } = req.body;

    // Parse tags if sent as a JSON string
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    let mediaUrl = null;

    // If a media file is uploaded, upload it to Cloudinary
    if (req.file) {
      mediaUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto", // automatically detect image/video
            folder: "stories",     // optional folder name in Cloudinary
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const newStory = new Story({
      title,
      author,
      storyBody,
      tags: parsedTags,
      mediaUrl, // This will be either Cloudinary URL or null
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

module.exports = { createStory, getAllStories };
