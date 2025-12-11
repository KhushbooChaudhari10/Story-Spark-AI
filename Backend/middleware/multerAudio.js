const multer = require("multer");

const storage = multer.memoryStorage();

const audioUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/") || file.mimetype === "video/webm") {
      cb(null, true);
    } else {
      cb(new Error("Invalid audio format!"), false);
    }
  }
});

module.exports = audioUpload;
