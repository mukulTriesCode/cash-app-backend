const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const entryRoutes = require("./routes/entry");
const categoryRoutes = require("./routes/category");
const { specs, swaggerUi } = require("./docs/swagger");

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

// Docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// ✅ Auth Routes
app.use("/api/", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/entry", entryRoutes);
app.use("/api/categories", categoryRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
if (process.env.IS_PRODUCTION !== false) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
