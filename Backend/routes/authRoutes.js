// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const User = require("../models/User");

// ✅ Register parent in MongoDB after Firebase signup
router.post("/register", async (req, res) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = await admin.auth().verifyIdToken(token);
    const { name } = req.body;

    // Check if parent already exists
    let existingUser = await User.findOne({ email: decoded.email });
    if (existingUser)
      return res.status(200).json({ message: "User already exists" });

    // ✅ Save parent in MongoDB
    const newUser = new User({
      name,
      email: decoded.email,
      role: "parent",
      children: [],
    });

    await newUser.save();

    res.status(201).json({
      message: "Parent registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

module.exports = router;
