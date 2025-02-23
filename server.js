const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

//CORS Config
app.use(cors());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});
app.use("/api", authRoutes);

module.exports = app;
