const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    PassoutYear: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },
    Role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userDatabase = mongoose.model("User", User);
module.exports = userDatabase;
