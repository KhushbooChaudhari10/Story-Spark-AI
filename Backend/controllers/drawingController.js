// controllers/drawingController.js
const Drawing = require('../models/Drawing');
const User = require('../models/User');

const getMyDrawings = async (req, res) => {
  try {
    // Firebase token only contains UID — not MongoDB ObjectId
    // so we look up the DB user first to resolve owner reference correctly
    const dbUser = await User.findOne({ firebaseUid: req.user.uid });

    if (!dbUser) return res.status(404).json({ message: 'User not found' });

    // reading drawings filtered by owner ensures a child only sees their own creations
    // sorting latest-first supports "most recent work" UX in dashboard
    const drawings = await Drawing.find({ owner: dbUser._id }).sort({ createdAt: -1 });

    res.json(drawings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getChildrenDrawings = async (req, res) => {
  try {
    // req.dbUser is injected by roleMiddleware, so we already know this is a parent
    // populating once saves extra queries when resolving children IDs
    const parent = req.dbUser;
    await parent.populate('children');

    // extract only child ObjectIds so we can filter drawings for all children at once
    const childIds = parent.children.map((c) => c._id);

    // using $in returns every matching drawing in one DB query
    // also populating owner gives parent visibility into which child drew which image
    const drawings = await Drawing
      .find({ owner: { $in: childIds } })
      .sort({ createdAt: -1 })
      .populate('owner', 'name age email');

    res.json(drawings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyDrawings, getChildrenDrawings };
