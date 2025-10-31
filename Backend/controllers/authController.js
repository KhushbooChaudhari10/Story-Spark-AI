// controllers/authController.js
const User = require('../models/User');

const registerDbUser = async (req, res) => {
  try {
    const { uid, email, name } = req.user; // from Firebase token

    // Check if user already exists in MongoDB
    let existing = await User.findOne({ firebaseUid: uid });

    if (existing) {
      return res.status(200).json({
        message: 'User already exists in MongoDB',
        user: existing
      });
    }

    // Create a new parent user
    const user = new User({
      name: name || req.body.name || "Parent User",
      email,
      firebaseUid: uid,
      role: "parent",
      children: []
    });

    await user.save();

    res.status(201).json({ message: "Parent registered in MongoDB", user });
  } catch (err) {
    console.error("registerDbUser error", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { registerDbUser };
