// models/UserJobModel.js
const mongoose = require('mongoose');
const jobFields = require('./jobFields'); // shared schema fields

const userJobSchema = new mongoose.Schema({
  ...jobFields, // <- deconstruction happens here too
  postedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
});

module.exports = mongoose.model("UserJob", userJobSchema);
