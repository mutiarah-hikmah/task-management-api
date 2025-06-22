const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Fungsi untuk mengetes koneksi saat server pertama kali berjalan
pool.connect((err) => {
    if (err) {
        console.error('Koneksi ke database GAGAL:', err.stack);
    } else {
        console.log('Berhasil terhubung ke database PostgreSQL.');
    }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};