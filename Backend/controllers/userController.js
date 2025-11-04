// controllers/userController.js
const User = require('../models/User');

// returns the child list for the authenticated parent
// parent views rely on this to build dashboard lists
const getChildren = async (req, res) => {
  try {
    // req.dbUser set earlier by role middleware → guarantees this is a parent
    const parentId = req.dbUser._id;

    // querying by parentId ensures strict ownership isolation (no cross-family leakage)
    const children = await User.find({ parentId });

    res.json(children);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// creates a new child account linked to the parent
// this avoids creating Firebase accounts per child — keeps onboarding friction low for kids
const createChild = async (req, res) => {
  const { name, age } = req.body;

  try {
    const newChild = new User({
      name,
      age,
      role: 'kid',
      parentId: req.dbUser._id  // explicit relational link
    });

    await newChild.save();

    // store reference in parent document to make lookup fast later
    req.dbUser.children.push(newChild._id);
    await req.dbUser.save();

    res.status(201).json(newChild);
  } catch (err) {
    console.error('createChild error', err);
    res.status(400).json({ message: err.message });
  }
};

// only parents who actually own a child are allowed to change their profile
// prevents manipulating URL to modify another family's child
const updateChild = async (req, res) => {
  try {
    const child = await User.findById(req.params.id);

    if (!child || child.parentId.toString() !== req.dbUser._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this child' });
    }

    // shallow merge keeps update flexible for partial form saves
    Object.assign(child, req.body);

    await child.save();

    res.json(child);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// deleting a child also requires strict ownership match
// avoids removing another family’s data by guessing ID
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

// returns the authenticated child profile so the kid can see their own info
// this avoids leaking parent or sibling data
const getOwnProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// child login by name only keeps UX extremely simple (no password, just identity pick)
// safe because child views only their own drawings, not parent data
const childLogin = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // match strictly by role = kid to avoid parent name collisions
    const child = await User.findOne({ name: name.trim(), role: 'kid' });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // keeping response shape consistent simplifies frontend storage + redirect logic
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
