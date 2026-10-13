const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const { initDB, pool } = require("./config/db");
const hotelRoutes = require("./routes/hotelRoutes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        origin === CLIENT_URL ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", async (req, res) => {
  let dbStatus = "disconnected";
  try {
    await pool.query("SELECT 1;");
    dbStatus = "connected";
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

app.use("/api/hotels", hotelRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await initDB();

  app.listen(PORT, () => {
    console.log("==========================================");
    console.log(` Hotel Management API Server Running!`);
    console.log(` Port: http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(` Uploads served at: http://localhost:${PORT}/uploads`);
    console.log(` Hotels API: http://localhost:${PORT}/api/hotels`);
    console.log("==========================================");
  });
}

startServer();

module.exports = app;
