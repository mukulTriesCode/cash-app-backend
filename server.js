const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const entryRoutes = require("./routes/entry");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// ✅ Auth Routes
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/entry", entryRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
if (process.env.IS_PRODUCTION !== false) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;