const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied, No token provided" });
  }

  // Check if the token starts with 'Bearer '
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verified.id).select("-password"); // remove password
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user; // attaching full user data to req.user
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
