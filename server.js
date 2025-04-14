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

// ✅ CORS Configuration - UPDATED
const allowedOrigins = [
  process.env.CORS_ORIGIN || "https://cash-app-react.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  // Add any additional frontend origins you're using
];

// Handle OPTIONS preflight requests explicitly
app.options("*", cors());

// Simplified CORS setup
app.use(
  cors({
    origin: true, // Allow all origins while debugging
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Add additional CORS headers for problematic clients
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// ✅ Auth Routes
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/entry", entryRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
if (process.env.IS_PRODUCTION !== false) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
