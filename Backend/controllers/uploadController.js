const cloudinary = require("cloudinary").v2;
const Drawing = require("../models/Drawing");
const User = require("../models/User");

// 🧠 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🖼️ Upload Drawing (for kid)
const uploadDrawing = async (req, res) => {
  try {
    const { childId } = req.body;

    // ✅ Validate child
    const child = await User.findOne({ _id: childId, role: "kid" });
    if (!child) return res.status(404).json({ message: "Child not found" });

    // ✅ Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "storyspark_drawings", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // ✅ Save to MongoDB
    const drawing = new Drawing({
      owner: child._id,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
    await drawing.save();

    res.status(200).json({ message: "Upload successful", drawing });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// 👩 Parent views all children's drawings
const getChildDrawings = async (req, res) => {
  try {
    const { parentId } = req.params;
    const children = await User.find({ parentId, role: "kid" });
    if (!children.length) return res.status(404).json({ message: "No children found" });

    const childIds = children.map((c) => c._id);
    const drawings = await Drawing.find({ owner: { $in: childIds } }).populate("owner", "name age");

    res.status(200).json({ drawings });
  } catch (err) {
    console.error("Error fetching drawings:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

const getDrawingsByChildId = async (req, res) => {
  try {
    const { childId } = req.params;
    const drawings = await Drawing.find({ owner: childId }).populate("owner", "name age");

    if (!drawings.length) return res.status(404).json({ message: "No drawings found" });
    res.status(200).json({ drawings });
  } catch (err) {
    console.error("Error fetching drawings:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// ✅ Export once here
module.exports = {
  uploadDrawing,
  getChildDrawings,
  getDrawingsByChildId,
};
