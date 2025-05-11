const mongoose = require("mongoose");

const Admin = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
      trim: true,
    },
    LastName: {
      type: String,
      required: true,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
      trim: true,
    },
    AdminID: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    Role: {
      type: String,
      default: "admin",
    },
    ResetToken: {
      type: String,
      default: null,
    },
    ResetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate AdminID before saving
Admin.pre("save", async function (next) {
  if (this.AdminID) return next(); // skip if already set

  try {
    const lastAdmin = await mongoose
      .model("Admin")
      .findOne({})
      .sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastAdmin && lastAdmin.AdminID) {
      const lastNum = parseInt(lastAdmin.AdminID.replace("ADM", ""));
      if (!isNaN(lastNum)) nextNumber = lastNum + 1;
    }

    this.AdminID = `ADM${String(nextNumber).padStart(3, "0")}`; // ADM001
    next();
  } catch (err) {
    next(err);
  }
});

const adminDatabase = new mongoose.model("Admin", Admin);
module.exports = adminDatabase;
