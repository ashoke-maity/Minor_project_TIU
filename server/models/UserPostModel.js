const mongoose = require("mongoose");
const commentSchema = require("./commentModel"); 
const jobDetailsSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String, required: true },
  salary: String,
  requirements: String,
  deadline: Date
}, { _id: false });

// Event details schema
const eventDetailsSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  location: { type: String, required: true },
  summary: String
}, { _id: false });

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

    // Specific schemas for different post types
    jobDetails: jobDetailsSchema,
    eventDetails: eventDetailsSchema,
    // donationDetails: donationDetailsSchema,

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