// controllers/StoryController.js
const Story = require("../models/AdminStoryModel");

// Create a new story
const createStory = async (req, res) => {
  try {
    const { title, author, storyBody, tags } = req.body;

    // Parse tags if they come in as a JSON string
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    const newStory = new Story({
      title,
      author,
      storyBody,
      tags: parsedTags,
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

module.exports = {createStory, getAllStories};