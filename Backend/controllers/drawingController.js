// controllers/drawingController.js
const Drawing = require('../models/Drawing');
const User = require('../models/User');

const getMyDrawings = async (req, res) => {
  try {
    const dbUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!dbUser) return res.status(404).json({ message: 'User not found' });
    const drawings = await Drawing.find({ owner: dbUser._id }).sort({ createdAt: -1 });
    res.json(drawings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getChildrenDrawings = async (req, res) => {
  try {
    // req.dbUser created by checkRole middleware
    const parent = req.dbUser;
    await parent.populate('children'); // get children array as objects
    const childIds = parent.children.map((c) => c._id);
    const drawings = await Drawing.find({ owner: { $in: childIds } }).sort({ createdAt: -1 }).populate('owner', 'name age email');
    res.json(drawings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyDrawings, getChildrenDrawings };
