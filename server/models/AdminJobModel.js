const mongoose = require('mongoose');

const adminJobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String, required: true },
  salary: { type: String },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  deadline: { type: Date, required: true },
  logo: { type: String }, // URL to logo image
  logoPublicId: { type: String }, // Cloudinary public ID for deletion
  postedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" } // Optional: to track who posted
}, { timestamps: true });

module.exports = mongoose.model("AdminJob", adminJobSchema);
