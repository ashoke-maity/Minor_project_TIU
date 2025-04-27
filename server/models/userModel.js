const mongoose = require("mongoose");
const User = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      require: true,
    },
    LastName: {
      type: String,
      require: true,
    },
    PassoutYear: {
      type: String,
      require: true,
    },
    Email: {
      type: String,
      require: true,
      unique: true,
    },
    Password: {
      type: String,
      require: true,
    },
    Role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const userDatabase = mongoose.model("User", User);
module.exports = userDatabase;
