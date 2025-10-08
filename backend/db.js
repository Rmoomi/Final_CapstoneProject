// backend/db.js
const mysql = require("mysql");

const connectDB = mysql.createConnection({
  host: process.env.DB_HOST || "localhost", // Local or remote host
  user: process.env.DB_USER || "root", // Local user or env var
  password: process.env.DB_PASS || "", // Local password or env var
  database: process.env.DB_NAME || "userdb", // Local DB name or env var
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306, // Default MySQL port
  // ✅ Optional SSL for Railway or other cloud MySQL providers
  // Uncomment if required:
  // ssl: process.env.DB_REQUIRE_SSL === "true" ? { rejectUnauthorized: true } : undefined,
});

connectDB.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

module.exports = connectDB;
