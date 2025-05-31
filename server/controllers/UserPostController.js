const UserPost = require("../models/UserPostModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

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
      const resourceType = req.file.mimetype.startsWith("video/")
        ? "video"
        : "image";
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
      return res
        .status(400)
        .json({ message: "Post must contain at least text or media." });
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

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};

// Get all posts for other users (excluding current user)
const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find posts where userId is NOT current user, and populate user details
    const posts = await UserPost.find({ userId: { $ne: userId } })
      .sort({ createdAt: -1 })
      .populate("userId", "FirstName LastName"); // <-- populate userId with these fields only

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Get all posts for feed (admin/user)
const getAllPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await UserPost.find()
      .sort({ createdAt: -1 })
      .populate("userId", "FirstName LastName")
      .populate("likes", "FirstName LastName");

    // Add isLiked field to each post
    const postsWithLikeStatus = posts.map((post) => ({
      ...post.toObject(),
      isLiked: post.likes.some(
        (like) => like._id.toString() === userId.toString()
      ),
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await UserPost.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.mediaUrl) {
      const urlParts = post.mediaUrl.split("/");
      // Find the index of "upload"
      const uploadIndex = urlParts.indexOf("upload");
      // The next part is the version (e.g., v1748693040), so skip it
      const publicIdParts = urlParts.slice(uploadIndex + 2); // +2 skips "upload" and version
      const fileNameWithExt = publicIdParts[publicIdParts.length - 1];
      const fileName = fileNameWithExt.split(".")[0];
      const folderParts = publicIdParts.slice(0, publicIdParts.length - 1);
      const publicId =
        folderParts.length > 0
          ? folderParts.join("/") + "/" + fileName
          : fileName;

      // Determine resource type
      let resourceType = "image";
      if (
        ["mp4", "mov", "avi", "webm"].includes(
          fileNameWithExt.split(".")[1]?.toLowerCase() || ""
        )
      ) {
        resourceType = "video";
      } else if (
        ["pdf", "doc", "docx", "xls", "xlsx"].includes(
          fileNameWithExt.split(".")[1]?.toLowerCase() || ""
        )
      ) {
        resourceType = "raw";
      }

      try {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType,
        });
      } catch (error) {
        return res.status(500).json({
          message: "Failed to delete media",
          error: error.message,
        });
      }
    }
    // Now delete the post from MongoDB
    await UserPost.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    // Emit socket event to all connected clients
    req.app.get("io").emit("postDeleted", req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// edit a post
const editPost = async (req, res) => {
  try {
    const { content } = req.body;
    const update = {};
    if (content) update.content = content;
    // Add media update logic if needed

    const post = await UserPost.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: update },
      { new: true }
    );
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update post" });
  }
};

// like a post
const likePost = async (req, res) => {
  try {
    const post = await UserPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user already liked the post
    if (post.likes.includes(req.user.id)) {
      // If already liked, unlike it
      post.likes.pull(req.user.id);
      await post.save();

      const populatedPost = await UserPost.findById(post._id).populate(
        "likes",
        "FirstName LastName"
      );

      return res.status(200).json({
        message: "Post unliked successfully",
        likeCount: populatedPost.likes.length,
        likedUsers: populatedPost.likes,
        isLiked: false,
      });
    }

    // If not liked, add the like
    post.likes.push(req.user.id);
    await post.save();

    // Populate the likes array with user information
    const populatedPost = await UserPost.findById(post._id).populate(
      "likes",
      "FirstName LastName"
    );

    res.status(200).json({
      message: "Post liked successfully",
      likeCount: populatedPost.likes.length,
      likedUsers: populatedPost.likes,
      isLiked: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to like post" });
  }
};

// unlike a post
const unlikePost = async (req, res) => {
  try {
    const post = await UserPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user has liked the post
    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: "Post not liked yet" });
    }

    // Remove the like
    post.likes.pull(req.user._id);
    await post.save();

    // Populate the likes array with user information
    const populatedPost = await UserPost.findById(post._id).populate(
      "likes",
      "FirstName LastName"
    );

    res.status(200).json({
      message: "Post unliked successfully",
      likeCount: populatedPost.likes.length,
      likedUsers: populatedPost.likes,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to unlike post" });
  }
};

// comment on a post
const commentOnPost = async (req, res) => {
  try {
    const post = await UserPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { commentText } = req.body;
    if (!commentText) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Create new comment
    const newComment = {
      userId: req.user.id,
      text: commentText,
    };

    // Add comment to post
    post.comments.push(newComment);
    await post.save();

    // Fetch the updated post with populated comment data
    const updatedPost = await UserPost.findById(post.id).populate({
      path: "comments.userId",
      select: "FirstName LastName",
    });

    // Get the last added comment
    const addedComment = updatedPost.comments[updatedPost.comments.length - 1];

    // Emit socket event
    req.app.get("io").emit("postCommented", {
      postId: post.id,
      comment: addedComment,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: addedComment,
    });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({
      message: "Failed to add comment",
      error: err.message,
    });
  }
};

// delete a comment
const deleteComment = async (req, res) => {
  try {
    const post = await UserPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const commentId = req.params.commentId;
    const commentIndex = post.comments.findIndex(
      (c) =>
        c._id.toString() === commentId &&
        c.userId.toString() === req.user._id.toString()
    );

    if (commentIndex === -1)
      return res.status(404).json({ message: "Comment not found" });

    post.comments.splice(commentIndex, 1);
    await post.save();

    // Emit socket event to all connected clients
    req.app.get("io").emit("commentDeleted", { postId: post.id, commentId });

    res.status(200).json({ message: "Comment deleted successfully", post });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

// save a post
const savePost = async (req, res) => {
  try {
    const post = await UserPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const userId = req.user.id;
    if (post.savedBy.includes(userId)) {
      return res.status(400).json({ message: "Post already saved" });
    }
    post.savedBy.push(userId);
    await post.save();
    res.status(200).json({ message: "Post saved successfully", post });
  } catch (err) {
    res.status(500).json({ message: "Failed to save post" });
  }
};

// unsave a post
const unsavePost = async (req, res) => {
  try {
    const post = await UserPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const userId = req.user._id;
    if (!post.savedBy.includes(userId)) {
      return res.status(400).json({ message: "Post not saved" });
    }
    post.savedBy.pull(userId);
    await post.save();
    res.status(200).json({ message: "Post unsaved successfully", post });
  } catch (err) {
    res.status(500).json({ message: "Failed to unsave post" });
  }
};

// only fetch my post (for my posts section)
const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await UserPost.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "FirstName LastName")
      .populate("likes", "FirstName LastName");

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

module.exports = {
  createPost,
  getUserPosts,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost,
  commentOnPost,
  deleteComment,
  savePost,
  unsavePost,
  editPost,
  getMyPosts,
};
