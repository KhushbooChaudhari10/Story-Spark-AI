const mongoose = require('mongoose');

const storybookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
  storyData: { type: Object, required: true }, // Final JSON story
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Storybook', storybookSchema);
