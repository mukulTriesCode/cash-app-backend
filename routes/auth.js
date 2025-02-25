const express = require("express");
const authMiddleware = require("../middleware/auth");
const controllers = require("../controllers/auth");

const router = express.Router();

const { registerController, loginController } = controllers;

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Protected Route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You have accessed a protected route!" });
});

module.exports = router;
