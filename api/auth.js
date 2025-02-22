const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    // Not connected
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

module.exports = async (req, res) => {
  await connectDB(); // Connect to MongoDB on each request

  if (req.method === "POST" && req.path === "/register") {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error registering user" });
    }
  } else if (req.method === "POST" && req.path === "/login") {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Invalid credentials" });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Error logging in" });
    }
  } else if (req.method === "GET" && req.path === "/protected") {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ message: "You have accessed a protected route!" });
    } catch (error) {
      res.status(400).json({ error: "Invalid token" });
    }
  } else {
    res.status(404).json({ error: "Not found" });
  }
};
