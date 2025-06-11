const multer = require("multer");
const path = require("path");

// Configure storage in memory (no need to save to disk)
const storage = multer.memoryStorage();

// File filter (optional: allow only images)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    ext === ".jpg" ||
    ext === ".jpeg" ||
    ext === ".png" ||
    ext === ".webp" ||
    ext === ".gif" ||
    ext === ".mp4" ||
    ext === ".webm" ||
    ext === ".mov" ||
    ext === ".avi" ||
    ext === ".mkv"
  ) {
    cb(null, true);
  } else {
    console.error("Blocked File Type:", ext);
    cb(new Error("Only images and videos are allowed"), false);
  }
};

const limits = {
  fileSize: 100 * 1024 * 1024 // 100MB limit for media files
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
