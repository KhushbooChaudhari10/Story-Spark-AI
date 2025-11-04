const Character = require('../models/Character');

// creating characters in DB allows reusing them later when building storybooks
// instead of generating characters repeatedly per story
const createCharacter = async (req, res) => {
  try {
    const { name, type, description, imageUrl, createdBy } = req.body;

    // storing createdBy gives ownership context — parents should only see/use their own assets
    const character = new Character({ name, type, description, imageUrl, createdBy });

    await character.save();

    // returning the actual created doc allows frontend to update UI instantly without re-fetching all
    res.status(201).json(character);

  } catch (err) {
    // 400 = user error — commonly missing fields or invalid values
    res.status(400).json({ message: err.message });
  }
};

// global fetch retrieves characters available for use (per parent) — important for character selection screens
const getCharacters = async (req, res) => {
  try {
    // populate exposes creator data in one query — avoids a second DB lookup on frontend
    const characters = await Character.find().populate('createdBy');

    res.json(characters);

  } catch (err) {
    // 500 = server failure — not caused by user input
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCharacter, getCharacters };
