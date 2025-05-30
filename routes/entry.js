const express = require("express");
const Entry = require("../models/Entry");
const Category = require("../models/Category");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Add Entry API
router.post("/add-entry", authMiddleware, async (req, res) => {
  try {
    const { amount, date, notes, category, isCashIn } = req.body;

    if (amount == null || !date || isCashIn == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Auto-create category if not exists
    if (category?.trim()) {
      let existingCategory = await Category.findOne({
        name: category.trim(),
        userId: req.user._id,
      });
      if (!existingCategory) {
        await Category.create({ name: category.trim(), userId: req.user._id });
      }
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

/**
 * @swagger
 * components:
 *   schemas:
 *     Entry:
 *       type: object
 *       required:
 *         - amount
 *         - date
 *         - isCashIn
 *       properties:
 *         amount:
 *           type: number
 *           description: The transaction amount
 *         date:
 *           type: string
 *           description: The date of the transaction
 *         notes:
 *           type: string
 *           description: Additional notes for the transaction
 *         category:
 *           type: string
 *           description: Category of the transaction
 *         isCashIn:
 *           type: boolean
 *           description: Whether this is an income (true) or expense (false)
 */

/**
 * @swagger
 * /api/entry/add-entry:
 *   post:
 *     summary: Create a new entry
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entry'
 *     responses:
 *       201:
 *         description: Entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 entry:
 *                   $ref: '#/components/schemas/Entry'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/entry/user:
 *   get:
 *     summary: Get all entries for the logged-in user
 *     tags: [Entries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       entry_id:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       date:
 *                         type: string
 *                       notes:
 *                         type: string
 *                       category:
 *                         type: string
 *                       isCashIn:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
