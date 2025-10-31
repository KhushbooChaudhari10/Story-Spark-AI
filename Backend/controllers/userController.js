// controllers/userController.js
const User = require('../models/User');

// 🧩 Get all children under a parent
const getChildren = async (req, res) => {
  try {
    const parentId = req.dbUser._id;
    const children = await User.find({ parentId });
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👩‍👧 Parent creates a child profile
const createChild = async (req, res) => {
  const { name, age } = req.body;

  try {
    const newChild = new User({
      name,
      age,
      role: 'kid',
      parentId: req.dbUser._id
    });

    await newChild.save();

    // add to parent's children array
    req.dbUser.children.push(newChild._id);
    await req.dbUser.save();

    res.status(201).json(newChild);
  } catch (err) {
    console.error('createChild error', err);
    res.status(400).json({ message: err.message });
  }
};

// 👩‍👧 Update child
const updateChild = async (req, res) => {
  try {
    const child = await User.findById(req.params.id);

    if (!child || child.parentId.toString() !== req.dbUser._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this child' });
    }

    Object.assign(child, req.body);
    await child.save();

    res.json(child);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👩‍👧 Delete child
const deleteChild = async (req, res) => {
  try {
    const child = await User.findById(req.params.id);
    if (!child || child.parentId.toString() !== req.dbUser._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this child' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Child deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧒 Child viewing own profile (optional)
const getOwnProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👶 Child Login by Name
const childLogin = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const child = await User.findOne({ name: name.trim(), role: 'kid' });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // ✅ Send consistent response shape
    res.status(200).json({ child });
  } catch (err) {
    console.error('childLogin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getChildren,
  createChild,
  updateChild,
  deleteChild,
  getOwnProfile,
  childLogin
};
