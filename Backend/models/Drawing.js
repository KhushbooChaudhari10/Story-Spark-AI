// models/Drawing.js
const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  // link drawing directly to a child account so parent queries can filter by parent → children
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // storing final uploaded image URL lets the frontend display from CDN / local FS without re-decoding blobs
  imageUrl: { type: String, required: true },

  // optional external asset id (Cloudinary or similar) — keeps migration flexible if storage method changes later
  publicId: { type: String },

  // timestamp helps show drawing history / progression (child growth tracking)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Drawing', drawingSchema);
