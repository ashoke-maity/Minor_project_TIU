const UserPost = require( "../models/UserPostModel");
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Create a new post
const createPost = async (req, res) => {
  try {
    const {
      postType = "regular",
      content,
      jobTitle,
      companyName,
      location,
      jobType,
      salary,
      requirements,
      deadline,
      eventName,
      eventDate,
      summary,
      donationTitle,
      goal,
      purpose,
    } = req.body;
    const userId = req.user.id;

     const extraData = {};

    if (postType === "job") {
      extraData.jobTitle = jobTitle;
      extraData.companyName = companyName;
      extraData.location = location;
      extraData.jobType = jobType;
      extraData.salary = salary;
      extraData.requirements = requirements;
      extraData.deadline = deadline;
    } else if (postType === "event") {
      extraData.eventName = eventName;
      extraData.eventDate = eventDate;
      extraData.location = location;
      extraData.summary = summary;
    } else if (postType === "donation") {
      extraData.donationTitle = donationTitle;
      extraData.goal = goal;
      extraData.purpose = purpose;
    }

    let mediaUrl = null;

    if (req.file) {
      const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
      mediaUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: resourceType },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    }

    if (!content && !mediaUrl) {
      return res.status(400).json({ message: "Post must contain at least text or media." });
    }

    let newPost = new UserPost({
      userId,
      postType: postType || "regular",
      content,
      mediaUrl,
      extraData,
    });

    await newPost.save();

    // Populate user info BEFORE emitting the socket event
newPost = await newPost.populate("userId", "FirstName LastName");

    req.app.get("io").emit("newPost", newPost);

    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};


const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find posts where userId is NOT current user, and populate user details
    const posts = await UserPost.find({ userId: { $ne: userId } })
      .sort({ createdAt: -1 })
      .populate("userId", "FirstName LastName");  // <-- populate userId with these fields only

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Get all posts for feed (admin/user)
const getAllPosts = async (req, res) => {
  try {
    const posts = await UserPost.find()
      .sort({ createdAt: -1 })
      .populate("userId", "FirstName LastName");  // <-- same here

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await UserPost.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Emit socket event to all connected clients
    req.app.get("io").emit("postDeleted", post._id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};

module.exports = {createPost, getUserPosts, getAllPosts, deletePost}