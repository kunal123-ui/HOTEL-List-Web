const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_SSL === "true" ||
        process.env.DATABASE_URL.includes("sslmode=require")
          ? { rejectUnauthorized: false }
          : false,
    }
  : {
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT) || 5432,
      database: process.env.PGDATABASE || "hotel_db",
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "postgres",
    };

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err.message);
});

async function initDB() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS hotels (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      latitude NUMERIC(10, 6) NOT NULL,
      longitude NUMERIC(10, 6) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      image VARCHAR(500) NOT NULL,
      rating NUMERIC(3, 2) DEFAULT 4.70,
      reviews INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_hotels_title ON hotels (LOWER(title));
    CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels (price);
  `;

  try {
    const client = await pool.connect();
    try {
      await client.query(createTableQuery);
      console.log("PostgreSQL: hotels table and indices verified/created.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("PostgreSQL Initialization Error:", err.message);
    console.warn("Please ensure PostgreSQL is running and database exists.");
  }
}

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  initDB,
};
