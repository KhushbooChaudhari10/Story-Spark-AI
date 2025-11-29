const mongoose = require('mongoose');

const storybookSchema = new mongoose.Schema({
  title: { type: String, required: true },

  // linking story to a parent user lets us filter storybooks per account
  // useful when showing each parent their own created storybooks
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // characters stored as references keeps the story lightweight
  // allows updating character details later without rewriting entire story JSON
  characters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],

  // the actual structured story output (scenes, instructions, canvas instructions)
  // saved as JSON so story can be re-rendered without re-generating it
  storyData: { type: Object, required: true },

  // timestamp is kept for sorting story history in dashboards / timeline UI
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Storybook', storybookSchema);
