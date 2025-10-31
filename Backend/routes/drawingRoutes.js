// routes/drawingRoutes.js
const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/authMiddleware');
const { getMyDrawings, getChildrenDrawings } = require('../controllers/drawingController');
const { checkRole } = require('../middleware/roleMiddleware');

router.get('/me', verifyFirebaseToken, getMyDrawings);
router.get('/children', verifyFirebaseToken, checkRole(['parent']), getChildrenDrawings);

module.exports = router;
