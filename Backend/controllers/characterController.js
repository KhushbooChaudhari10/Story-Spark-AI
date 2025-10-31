const Character = require('../models/Character');

// Create new character
const createCharacter = async (req, res) => {
  try {
    const { name, type, description, imageUrl, createdBy } = req.body;
    const character = new Character({ name, type, description, imageUrl, createdBy });
    await character.save();
    res.status(201).json(character);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all characters
const getCharacters = async (req, res) => {
  try {
    const characters = await Character.find().populate('createdBy');
    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCharacter, getCharacters };
