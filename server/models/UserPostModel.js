const mongoose = require("mongoose");
const commentSchema = require("./commentModel"); 

const userPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postType: {
      type: String,
      enum: ["regular", "job", "event", "media", "donation"],
      default: "regular",
    },
    content: { type: String },
    mediaUrl: { type: String },

    // Stores job/event/donation specific fields
    extraData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Users who liked the post
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Users who saved the post
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Comments on the post
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPost", userPostSchema);
