const express = require('express');
const router = express.Router();
const { createCharacter, getCharacters } = require('../controllers/characterController');

// exposing character endpoints separately keeps the main server file light
// this makes character management isolated so future updates (new character types, attributes) won't affect other routes
router.post('/', createCharacter);

// reading characters via dedicated controller supports future scaling —
// for example: filtering by parent, pagination, role based access
router.get('/', getCharacters);

module.exports = router;
