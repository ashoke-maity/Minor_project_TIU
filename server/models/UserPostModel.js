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
      enum: [ "regular", "job", "event", "media", "donation"],
      default: "regular",
    },
    content: { type: String },
    mediaUrl: { type: String },
    extraData: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPost", userPostSchema);
