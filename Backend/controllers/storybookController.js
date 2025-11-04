const Storybook = require('../models/Storybook');

// storing a storybook as a single document makes re-rendering possible later
// without needing to regenerate the story each time (saves compute + keeps UX fast)
const createStorybook = async (req, res) => {
  try {
    const { title, createdBy, characters, storyData } = req.body;

    // keeping storyData raw JSON allows flexible rendering engines later
    // (canvas renderer, ebook export, animated scene builder, etc.)
    const storybook = new Storybook({ title, createdBy, characters, storyData });
    await storybook.save();

    // return newly created resource so UI can update immediately
    res.status(201).json(storybook);

  } catch (err) {
    // 400 → mostly caused by invalid schema input (developer/debugging signal)
    res.status(400).json({ message: err.message });
  }
};

// retrieving storybooks like this allows building a gallery / library UI
// parents can browse previously generated stories without re-running generation pipeline
const getStorybooks = async (req, res) => {
  try {
    const storybooks = await Storybook.find()
      // exposing parent allows accountability → which user created which stories
      .populate('createdBy')
      // populate characters so UI can instantly show visual cards instead of separate DB calls
      .populate('characters');

    res.json(storybooks);

  } catch (err) {
    // 500 → internal issue, nothing the user can fix
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createStorybook, getStorybooks };
