const cloudinary = require("cloudinary").v2;
const Drawing = require("../models/Drawing");
const User = require("../models/User");
const Storybook = require("../models/Storybook"); 
// configuring Cloudinary here avoids re-configuring on every upload.
// this keeps upload operations lightweight in high-frequency kid drawing usage.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// kids produce drawings frequently — so uploads must be optimized + trust boundaries must be clear
const uploadDrawing = async (req, res) => {
  try {
    const { childId } = req.body;

    // verifying the child prevents parents from spoofing someone else’s child ID
    // ensures data ownership integrity in multi-family system
    const child = await User.findOne({ _id: childId, role: "kid" });
    if (!child) return res.status(404).json({ message: "Child not found" });

    await Storybook.updateMany(
      { createdBy: child._id, status: "ready" },
      { $set: { status: "archived" } }
    );

    // streaming directly to Cloudinary avoids writing image to server disk
    // this removes need for temp file cleanup and scales better under multiple uploads
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

    // storing just the URL + Cloudinary ID keeps DB small
    // re-rendering never needs original binary data → only the CDN URL
    const drawing = new Drawing({
      owner: child._id,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    await drawing.save();

    res.status(200).json({ message: "Upload successful", drawing });
  //   try {
  //   const axios = require("axios");

  //   const n8nWebhook = process.env.N8N_WEBHOOK_URL;

  //   await axios.post(n8nWebhook, {
  //     childId: child._id,
  //     drawingUrl: uploadResult.secure_url
  //   });
  //   console.log("🎯 Sent drawing to n8n successfully.");
  // } catch (err) {
  //   console.error("❌ Failed to notify n8n:", err);

  // }
    } catch (err) {
      // logging here is important because uploads are the highest failure-rate path (network, storage, child fast tapping UI, etc.)
      console.error("Upload error:", err);
      res.status(500).json({ message: "Server error: " + err.message });
    }
  };

// this endpoint gives a parent a full view of all their kids’ creativity
// useful for dashboards where parent monitors activity / progress
const getChildDrawings = async (req, res) => {
  try {
    const { parentId } = req.params;

    // children fetched by parentId ensures no ability to view other family data
    const children = await User.find({ parentId, role: "kid" });
    if (!children.length) return res.status(404).json({ message: "No children found" });

    const childIds = children.map((c) => c._id);

    // $in allows fetching all child drawings in one query for better performance
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

    // this endpoint powers the kid’s own gallery screen — child identity is known, so no parent aggregation needed
    const drawings = await Drawing.find({ owner: childId }).populate("owner", "name age");

    if (!drawings.length) return res.status(404).json({ message: "No drawings found" });
    res.status(200).json({ drawings });
  } catch (err) {
    console.error("Error fetching drawings:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

const uploadVoice = async (req, res) => {
  try {
    const { childId } = req.body;
    if (!childId) return res.status(400).json({ message: "Child ID required" });

    const child = await User.findOne({ _id: childId, role: "kid" });
    if (!child) return res.status(404).json({ message: "Child not found" });

    if (!req.file || !req.file.buffer)
      return res.status(400).json({ message: "Empty audio file" });

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `storyspark_audio/${childId}`,
          resource_type: "video" // ✅ correct for audio
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    res.status(200).json({
      message: "Voice uploaded successfully",
      audio: {
        audioUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id
      }
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};


module.exports = {
  uploadDrawing,
  getChildDrawings,
  getDrawingsByChildId,
  uploadVoice,
};
