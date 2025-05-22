const UserPost = require( "../models/UserPostModel");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { postType, content, mediaUrl, extraData } = req.body;
    const userId = req.user.id;

    if (!content && !mediaUrl) {
      return res.status(400).json({ message: "Post must contain at least text or media." });
    }

    let newPost = new UserPost({
      userId,
      postType: postType || "general",
      content,
      mediaUrl,
      extraData,
    });

    await newPost.save();

    // Populate user info BEFORE emitting the socket event
newPost = await newPost.populate("userId", "FirstName LastName");

    req.app.get("io").emit("newPost", newPost);

    console.log("Emitted newPost via socket:", newPost);
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
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