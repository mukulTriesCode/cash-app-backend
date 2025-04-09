const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

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
app.use("/api", authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
if (process.env.IS_PRODUCTION !== false) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;