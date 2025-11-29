const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // storing a category/type enables filtering / suggestions later
  // e.g. "hero", "animal", "robot" — helps AI or story UI recommend characters
  type: { type: String, required: true },

  // lightweight metadata helps story generator display context or hints without loading images first
  description: { type: String },

  // storing image reference allows using prebuilt art assets rather than redrawing every time
  // makes UI faster — especially when selecting characters visually
  imageUrl: { type: String },

  // link back to the parent account — ensures characters remain private per family
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // timestamp supports ordering UI (latest created at top) in dashboards
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Character', characterSchema);
