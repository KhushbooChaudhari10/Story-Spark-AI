// controllers/authController.js
const User = require('../models/User');

const registerDbUser = async (req, res) => {
  try {
    // Firebase already guarantees identity + email ownership
    // so we use decoded token values instead of trusting client-sent payloads
    const { uid, email, name } = req.user; 

    // prevents duplicate creation if signup route is triggered multiple times
    // common scenario: user refreshes immediately after signup
    let existing = await User.findOne({ firebaseUid: uid });

    if (existing) {
      return res.status(200).json({
        message: 'User already exists in MongoDB',
        user: existing
      });
    }

    // storing user in DB enables application-side domain state
    // Firebase only handles identity — not role, children list, storybooks, etc.
    const user = new User({
      name: name || req.body.name || "Parent User", // token sometimes does not contain display name
      email,
      firebaseUid: uid,
      role: "parent",      // defaulting signup to parent accounts
      children: []         // children will be attached later
    });

    // once stored, user can now interact with DB-based domain features (children, drawings, storybooks)
    await user.save();

    res.status(201).json({ message: "Parent registered in MongoDB", user });
  } catch (err) {
    // logging allows diagnosing issues in production, not just local
    console.error("registerDbUser error", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { registerDbUser };
