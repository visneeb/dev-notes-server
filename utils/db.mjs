import { Pool } from "pg";


console.log("CONNECTION_STRING:", process.env.CONNECTION_STRING ? "Loaded" : "NOT LOADED!");

const connectionPool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

connectionPool.on("error", (err) => {
  console.error("Database pool error:", err.message);
});

// Test connection on startup
connectionPool.query("SELECT NOW()")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err.message));

export default connectionPool;