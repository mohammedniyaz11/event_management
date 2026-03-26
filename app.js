require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
// Routes
// const authRoutes = require("./routes/auth.routes");
// const eventRoutes = require("./routes/event.routes");

const app = express();

/**
 * ========================
 * GLOBAL MIDDLEWARES
 * ========================
 */

// Parse JSON
app.use(express.json());




/**
 * ========================
 * DATABASE CONNECTION
 * ========================
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

/**
 * ========================
 * HEALTH CHECK ROUTE
 * ========================
 */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "🚀 Event Management API is running",
  });
});

/**
 * ========================
 * ROUTES
 * ========================
 */
// app.use("/api/auth", authRoutes);
// app.use("/api/events", eventRoutes);

/**
 * ========================
 * 404 HANDLER
 * ========================
 */
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
  });
});

/**
 * ========================
 * GLOBAL ERROR HANDLER
 * ========================
 */
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;