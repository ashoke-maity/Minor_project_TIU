const mongoose = require("mongoose");
const UserPost = require("../models/UserPostModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { postType = "regular", content } = req.body;
    const userId = req.user.id;

    // Parse job and event details from form data
    const jobDetails = req.body.jobDetails ? JSON.parse(req.body.jobDetails) : null;
    const eventDetails = req.body.eventDetails ? JSON.parse(req.body.eventDetails) : null;
    const donationDetails = req.body.donationDetails ? JSON.parse(req.body.donationDetails) : null;

    let postData = {
      userId,
      postType,
      content
    };

    // Add the details based on post type
    if (postType === "job" && jobDetails) {
      postData.jobDetails = {
        jobTitle: jobDetails.jobTitle,
        companyName: jobDetails.companyName,
        location: jobDetails.location,
        jobType: jobDetails.jobType,
        salary: jobDetails.salary,
        requirements: jobDetails.requirements,
        deadline: jobDetails.deadline
      };
    }

    if (postType === "event" && eventDetails) {
      postData.eventDetails = {
        eventName: eventDetails.eventName,
        eventDate: eventDetails.eventDate,
        location: eventDetails.location,
        summary: eventDetails.summary
      };
    }

    if (postType === "donation" && donationDetails) {
      postData.donationDetails = {
        donationTitle: donationDetails.donationTitle,
        goal: donationDetails.goal,
        purpose: donationDetails.purpose
      };
    }

    if (req.file) {
      try {
        const resourceType = req.file.mimetype.startsWith("video/") ? "video" : "image";
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              resource_type: resourceType,
              folder: "alumni_connect",
              allowed_formats: resourceType === "video" ? 
                ["mp4", "webm", "mov", "avi"] : 
                ["jpg", "jpeg", "png", "gif", "webp"]
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });

        postData.mediaUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Media upload error:", uploadError);
        return res.status(500).json({ 
          message: "Failed to upload media", 
          error: uploadError.message 
        });
      }
    }

    let newPost = new UserPost(postData);
    await newPost.save();

    // Populate user info before sending response
    newPost = await newPost.populate("userId", "FirstName LastName");

    req.app.get("io").emit("newPost", newPost);

    res.status(201).json({
      message: "Post created successfully",
      post: newPost
    });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all posts for other users (excluding current user)
const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find posts where userId is NOT current user, and populate user details
    const posts = await UserPost.find()
      .sort({ createdAt: -1 })
      .populate("userId", "FirstName LastName") // <-- populate userId with these fields only
      .populate("likes", "FirstName LastName");

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

// Get all posts for feed (admin/user)
const getAllPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await UserPost.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "FirstName LastName",
      })
      .populate({
        path: "likes",
        select: "FirstName LastName Email",
      })
      .populate({
        path: "comments.userId",
        select: "FirstName LastName _id",
      });

    const postsWithDetails = posts.map((post) => {
      const postObj = post.toObject();
      return {
        ...postObj,
        isLiked: post.likes.some(
          (like) => like._id.toString() === userId.toString()
        ),
        comments: post.comments.map((comment) => ({
          _id: comment._id,
          text: comment.text,
          createdAt: comment.createdAt,
          userId: {
            _id: comment.userId._id,
            FirstName: comment.userId.FirstName,
            LastName: comment.userId.LastName,
          },
        })),
      };
    });

    res.status(200).json(postsWithDetails);
  } catch (err) {
    console.error("Error fetching posts:", err);
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
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });

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

    // Create new comment with user details
    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      userId: req.user.id,
      text: commentText,
      createdAt: new Date(),
      userDetails: {
        FirstName: req.user.FirstName,
        LastName: req.user.LastName,
      },
    };

    post.comments.push(newComment);
    await post.save();

    // Send response with complete user information
    res.status(201).json({
      message: "Comment added successfully",
      comment: {
        ...newComment,
        userId: {
          _id: req.user.id,
          FirstName: req.user.FirstName,
          LastName: req.user.LastName,
        },
      },
    });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// Update the deleteComment function
const deleteComment = async (req, res) => {
  try {
    const post = await UserPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const commentId = req.params.commentId;
    const commentIndex = post.comments.findIndex(
      (c) => c._id.toString() === commentId
    );

    if (commentIndex === -1)
      return res.status(404).json({ message: "Comment not found" });

    // Check if the user is authorized to delete the comment
    if (post.comments[commentIndex].userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

// save a post
const savePost = async (req, res) => {
  try {
    const post = await UserPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id; // Get userId from auth middleware

    // Check if already saved
    if (post.savedBy.includes(userId)) {
      return res.status(400).json({ message: "Post already saved" });
    }

    // Add to savedBy array
    post.savedBy.push(userId);
    await post.save();

    res.status(200).json({
      message: "Post saved successfully",
      post: post,
      saved: true,
      status: 1
    });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Failed to save post" });
  }
};

// fetch the saved posts of the user
const getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await UserPost.find({ savedBy: userId })
      .sort({ createdAt: -1 })
      .populate("userId", "FirstName LastName")
      .populate("likes", "FirstName LastName");

    const postsWithLikeStatus = posts.map((post) => ({
      ...post.toObject(),
      isLiked: post.likes.some(
        (like) => like._id.toString() === userId.toString()
      ),
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved posts" });
  }
};

// unsave post
const unsavePost = async (req, res) => {
  try {
    const post = await UserPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user.id;

    // Check if post is saved
    const savedIndex = post.savedBy.indexOf(userId);
    if (savedIndex === -1) {
      return res.status(400).json({ message: "Post is not saved" });
    }

    // Remove from savedBy array
    post.savedBy.splice(savedIndex, 1);
    await post.save();

    res.status(200).json({
      message: "Post unsaved successfully",
      post: post,
      saved: false,
      status: 1
    });
  } catch (err) {
    console.error("Unsave error:", err);
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

// // get event posts (all events created by users / admins)
const getEventPosts = async (req, res) => {
  try {
    const posts = await UserPost.find({ postType: "event" })
      .sort({ createdAt: -1 })
      .populate("userId", "FirstName LastName")
      .populate("likes", "FirstName LastName");

    const postsWithLikeStatus = posts.map((post) => ({
      ...post.toObject(),
      isLiked: post.likes.some(
        (like) => like._id.toString() === req.user.id.toString()
      ),
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch event posts" });
  }
};

// get job posts (all jobs created by users / admins)
const getJobPosts = async (req, res) => {
  try {
    const posts = await UserPost.find({ postType: "job" })
      .sort({ createdAt: -1 })
      .populate("userId", "FirstName LastName")
      .populate("likes", "FirstName LastName");

    const postsWithLikeStatus = posts.map((post) => ({
      ...post.toObject(),
      isLiked: post.likes.some(
        (like) => like._id.toString() === req.user.id.toString()
      ),
    }));

    res.status(200).json(postsWithLikeStatus);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job posts" });
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
  getSavedPosts,
  getEventPosts,
  getJobPosts,
};
