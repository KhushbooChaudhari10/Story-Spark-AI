const Storybook = require('../models/Storybook');

// Create a new storybook
const createStorybook = async (req, res) => {
  try {
    const { title, createdBy, characters, storyData } = req.body;
    const storybook = new Storybook({ title, createdBy, characters, storyData });
    await storybook.save();
    res.status(201).json(storybook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all storybooks
const getStorybooks = async (req, res) => {
  try {
    const storybooks = await Storybook.find()
      .populate('createdBy')
      .populate('characters');
    res.json(storybooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createStorybook, getStorybooks };
