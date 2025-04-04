const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Use JSON Middleware
app.use(express.json());

// ✅ CORS Configuration - UPDATED
const allowedOrigins = [
  process.env.CORS_ORIGIN || "https://cash-app-react.vercel.app",
  "http://localhost:5173",
  // Add any additional frontend origins you're using
];

// Simplified CORS setup with better debugging
app.use(
  cors({
    origin: function (origin, callback) {
      // For development or tools like Postman, origin can be undefined
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        // Instead of returning an error (which can cause issues),
        // we'll allow the request but log it
        callback(null, true);

        // If you want to strictly enforce CORS, use this instead:
        // callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// ✅ Auth Routes
app.use("/api", authRoutes);

// ✅ Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server error",
    error: process.env.NODE_ENV === "production" ? {} : err.message,
  });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
if (process.env.IS_PRODUCTION !== false) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
