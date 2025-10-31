const express = require('express');
const router = express.Router();
const { createStorybook, getStorybooks } = require('../controllers/storybookController');

router.post('/', createStorybook);
router.get('/', getStorybooks);

module.exports = router;
