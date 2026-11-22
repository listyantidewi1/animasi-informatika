// Koneksi ke PostgreSQL. Alamat database diambil dari environment variable.
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = { pool };
