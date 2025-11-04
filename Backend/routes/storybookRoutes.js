const express = require('express');
const router = express.Router();
const { createStorybook, getStorybooks } = require('../controllers/storybookController');

// separating storybook endpoints keeps narrative data / structure isolated
// this prevents story logic from being mixed into auth or drawing logic
router.post('/', createStorybook);

// retrieving storybooks through a controller makes future enhancements easier
// e.g. filtering by age group, personalization based on reading history, etc.
router.get('/', getStorybooks);

module.exports = router;
