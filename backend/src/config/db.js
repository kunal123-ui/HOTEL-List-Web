const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.PGHOST || "localhost",
        port: Number(process.env.PGPORT) || 5432,
        database: process.env.PGDATABASE || "hotel_db",
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "postgres",
      }
);

pool.on("error", (err) => {
  console.error("Database connection error:", err.message);
});

async function initDB() {
  const query = `
    CREATE TABLE IF NOT EXISTS hotels (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      latitude NUMERIC(10, 6) NOT NULL,
      longitude NUMERIC(10, 6) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      image TEXT NOT NULL,
      rating NUMERIC(3, 2) DEFAULT 4.70,
      reviews INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_hotels_title ON hotels (LOWER(title));
    CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels (price);
  `;

  try {
    await pool.query(query);
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database initialization error:", err.message);
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDB,
};
