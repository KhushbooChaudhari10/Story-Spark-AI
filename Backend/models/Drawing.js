// models/Drawing.js
const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // child owner
  imageUrl: { type: String, required: true },
  publicId: { type: String }, // if using Cloudinary
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Drawing', drawingSchema);
