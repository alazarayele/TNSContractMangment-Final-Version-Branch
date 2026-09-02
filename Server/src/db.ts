import mysql from 'mysql2/promise'; // Use promise-based API
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Test connection on startup
pool.getConnection()
  .then((conn) => {
    console.log('Connected to MySQL!');
    conn.release();
  })
  .catch((err) => {
    console.error('DB Connection Failed:', err);
    process.exit(1); // Crash app if DB is down
  });

export default pool;