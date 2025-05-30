const express = require("express");
const router = express.Router();
const { getCategories } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/auth"); // assuming this is your middleware

router.get("/", authMiddleware, getCategories);

module.exports = router;
