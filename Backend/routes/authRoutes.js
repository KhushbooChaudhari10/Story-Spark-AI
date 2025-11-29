// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const User = require("../models/User");

// this endpoint exists because Firebase handles account creation,
// but MongoDB stores parent metadata and application-specific roles
router.post("/register", async (req, res) => {
  try {
    // extracting Firebase token so backend can trust identity without storing password
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // verifying token server-side ensures request can't be faked even if frontend JS is modified
    const decoded = await admin.auth().verifyIdToken(token);
    const { name } = req.body;

    // avoid duplicate parent creation if Firebase account already completed earlier onboarding
    let existingUser = await User.findOne({ email: decoded.email });
    if (existingUser)
      return res.status(200).json({ message: "User already exists" });

    // storing in MongoDB allows attaching children, drawings, progress, etc.
    // Firebase only stores identity — this DB stores domain-specific data
    const newUser = new User({
      name,
      email: decoded.email,
      role: "parent",      // marking role here enables role-based control later (parent vs child)
      children: [],
    });

    // saving record so future requests know this parent has completed onboarding
    await newUser.save();

    res.status(201).json({
      message: "Parent registered successfully",
      user: newUser,
    });
  } catch (err) {
    // backend logging helps debugging production issues where frontend can't see errors
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

module.exports = router;
