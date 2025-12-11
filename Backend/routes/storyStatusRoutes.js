const express = require("express");
const router = express.Router();
const Storybook = require("../models/Storybook");

router.post("/complete", async (req, res) => {
  try {
    const { childId, storyData, title } = req.body;

    const saved = await Storybook.create({
      title: title || "Untitled Story",
      createdBy: childId,
      storyData,
      status: "ready"
    });

    res.json({ message: "Story saved", storybook: saved });
  } catch (err) {
    console.error("❌ Error saving story:", err);
    res.status(500).json({ error: "Failed to save story" });
  }
});

router.get("/child/:childId", async (req, res) => {
  const { childId } = req.params;
  const story = await Storybook.findOne({ createdBy: childId, status: "ready" }).sort({ createdAt: -1 });
  res.json(story || null);
});

module.exports = router;
