const express = require("express");
const Entry = require("../models/Entry");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Add Entry API
router.post("/add-entry", authMiddleware, async (req, res) => {
  try {
    const { amount, date, notes, category, isCashIn } = req.body;

    if (amount == null || !date || isCashIn == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEntry = new Entry({
      amount,
      date,
      notes,
      category: category || "",
      isCashIn,
      user: req.user._id,
    });

    await newEntry.save();

    res.status(201).json({
      message: "Entry added successfully",
      entry: newEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const entries = await Entry.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: entries.length,
      data: entries.map((entry) => ({
        entry_id: entry._id,
        amount: entry.amount,
        date: entry.date,
        notes: entry.notes,
        category: entry.category,
        isCashIn: entry.isCashIn,
      })),
    });
  } catch (error) {
    console.error("Error fetching user entries:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching entries",
    });
  }
});

module.exports = router;
