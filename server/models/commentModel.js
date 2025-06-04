const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    userDetails: {
      FirstName: String,
      LastName: String,
      profileImage: String,
    }
  },
  { 
    timestamps: true,
    _id: true 
  }
);

module.exports = commentSchema;