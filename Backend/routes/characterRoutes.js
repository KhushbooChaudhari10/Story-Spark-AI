const express = require('express');
const router = express.Router();
const { createCharacter, getCharacters } = require('../controllers/characterController');

router.post('/', createCharacter);
router.get('/', getCharacters);

module.exports = router;
