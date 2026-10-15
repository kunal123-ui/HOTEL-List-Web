const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { initDB, pool } = require("./config/db");
const hotelRoutes = require("./routes/hotelRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1;");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.json({ status: "error", database: "disconnected", message: err.message });
  }
});

// Routes
app.use("/api/hotels", hotelRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();

module.exports = app;