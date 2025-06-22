const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Menjalankan file koneksi database
// Baris ini akan mencoba menghubungkan ke DB saat server start
require('./src/config/db');

const userRoutes = require('./src/routes/userRoutes'); 
const projectRoutes = require('./src/routes/projectRoutes.js'); // <-- IMPORT RUTE PROYEK
const taskRoutes = require('./src/routes/taskRoutes.js'); // <-- IMPORT RUTE TUGAS

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware dasar
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route untuk pengetesan
app.get('/', (req, res) => {
  res.send('Horeyy aku bisa');
});

// Gunakan Rute
app.use('/api/users', userRoutes); // <-- Tambahkan ini
app.use('/api/projects', projectRoutes); // <-- GUNAKAN RUTE PROYEK
app.use('/api/tasks', taskRoutes); // <-- GUNAKAN RUTE TUGAS

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});