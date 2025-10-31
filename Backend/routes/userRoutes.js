// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const verifyFirebaseToken = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { childLogin } = require('../controllers/userController');

const {
  getChildren,
  createChild,
  updateChild,
  deleteChild,
  getOwnProfile
} = require('../controllers/userController');

router.post('/children/login', childLogin);

// All routes require authentication
router.use(verifyFirebaseToken);

// 👩‍👧 Parent routes
router.get('/children', checkRole(['parent']), getChildren);
router.post('/children', checkRole(['parent']), createChild);
router.put('/children/:id', checkRole(['parent']), updateChild);
router.delete('/children/:id', checkRole(['parent']), deleteChild);


// 🧒 Child route
router.get('/me', checkRole(['kid']), getOwnProfile);

module.exports = router;
