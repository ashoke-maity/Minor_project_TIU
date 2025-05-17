const mongoose = require("mongoose");

const userPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postType: {
      type: String,
      enum: ["event", "donation", "poll", "job", "general", "video"],
      default: "general",
    },
    content: { type: String },
    mediaUrl: { type: String },
    extraData: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPost", userPostSchema);
