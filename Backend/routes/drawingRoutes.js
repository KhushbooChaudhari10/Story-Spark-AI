// routes/drawingRoutes.js
const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/authMiddleware');
const { getMyDrawings, getChildrenDrawings } = require('../controllers/drawingController');
const { checkRole } = require('../middleware/roleMiddleware');

// this endpoint serves drawings belonging to the authenticated child directly
// child accounts should only ever see their own drawings — no parent filtering needed here
router.get('/me', verifyFirebaseToken, getMyDrawings);

// this endpoint is only for parents — they should be able to view all drawings under their account
// role check prevents children from accessing multi-child data and keeps privacy boundaries intact
router.get('/children', verifyFirebaseToken, checkRole(['parent']), getChildrenDrawings);

module.exports = router;
