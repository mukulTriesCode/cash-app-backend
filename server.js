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

// ✅ CORS Configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN || "https://cash-app-react.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, // Allow frontend origins
    credentials: true, // Allow cookies & auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle OPTIONS Preflight Requests Globally
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    allowedOrigins.includes(req.headers.origin) ? req.headers.origin : ""
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// ✅ Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// ✅ Auth Routes
app.use("/api", authRoutes);

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
if (process.env.IS_PRODUCTION !== false) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
