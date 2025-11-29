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

// child login is public because kids authenticate only by name
// identity link happens server-side after this call
router.post('/children/login', childLogin);

// protect all routes going forward so only Firebase-authenticated sessions can continue
router.use(verifyFirebaseToken);

// parent can manage multiple children — secure role check ensures only parent accounts can perform CRUD actions
router.get('/children', checkRole(['parent']), getChildren);
router.post('/children', checkRole(['parent']), createChild);
router.put('/children/:id', checkRole(['parent']), updateChild);
router.delete('/children/:id', checkRole(['parent']), deleteChild);

// child dashboard needs to fetch its own profile only
// strict kid role check prevents a child from querying other child accounts
router.get('/me', checkRole(['kid']), getOwnProfile);

module.exports = router;
