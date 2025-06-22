const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =================================================================
// Fungsi untuk Registrasi Pengguna
// =================================================================
exports.register = async (req, res) => {
  // Ambil data dari request body
  const { username, email, password } = req.body;

  // Validasi sederhana
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field (username, email, password) wajib diisi' });
  }

  try {
    // HASH PASSWORD! Jangan pernah simpan password sebagai plain text.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan pengguna baru ke database
    const queryText = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email, username';
    const queryValues = [username, email, hashedPassword];

    const newUser = await db.query(queryText, queryValues);

    // Kirim respons sukses
    res.status(201).json({
      message: 'Pengguna berhasil didaftarkan!',
      user: newUser.rows[0],
    });

  } catch (error) {
    // Tangani jika ada error (misal: email sudah terdaftar)
    console.error('Error saat registrasi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};


// =================================================================
// Fungsi untuk Login Pengguna
// =================================================================
exports.login = async (req, res) => {
  // Ambil email dan password dari request body
  const { email, password } = req.body;

  // Validasi sederhana
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    // Cari pengguna di database berdasarkan email
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // Jika email tidak ditemukan, kirim error
      return res.status(401).json({ message: 'Email atau password salah' });
    }
    const user = userResult.rows[0];

    // Bandingkan password yang diinput dengan password HASH di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Jika password tidak cocok, kirim error
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // Jika password cocok, buat JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id,
        email: user.email
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ambil kunci rahasia dari file .env
      { expiresIn: '1h' } // Token akan kadaluarsa dalam 1 jam
    );

    // Kirim token ke klien
    res.status(200).json({
      message: 'Login berhasil!',
      token: token
    });

  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// =================================================================
// Fungsi untuk Mendapatkan Data Pengguna yang Sedang Login
// =================================================================
exports.getMe = async (req, res) => {
  try {
    // Ingat? authMiddleware menyimpan data user di req.user
    // Kita bisa ambil ID pengguna dari situ.
    const userId = req.user.id;

    // Cari pengguna di database berdasarkan ID dari token
    // Kita hanya mengambil field yang aman untuk ditampilkan (JANGAN AMBIL PASSWORD)
    const user = await db.query(
      'SELECT id, username, email, avatar_url FROM users WHERE id = $1',
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    res.status(200).json(user.rows[0]);

  } catch (error) {
    console.error('Error saat mengambil data pengguna:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// =================================================================
// Fungsi untuk Update Profil Pengguna
// =================================================================
exports.updateMe = async (req, res) => {
  const { id } = req.user; // Ambil ID dari token
  const { username, password } = req.body;

  // Kumpulkan field yang akan di-update
  const updateFields = [];
  const queryValues = [];
  let queryParamIndex = 1;

  // Jika ada username baru
  if (username) {
    updateFields.push(`username = $${queryParamIndex++}`);
    queryValues.push(username);
  }

  // Jika ada password baru, hash terlebih dahulu
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updateFields.push(`password = $${queryParamIndex++}`);
    queryValues.push(hashedPassword);
  }

  // Jika ada file avatar baru yang di-upload
  if (req.file) {
    // Simpan path file ke database
    const avatarUrl = req.file.path;
    updateFields.push(`avatar_url = $${queryParamIndex++}`);
    queryValues.push(avatarUrl);
  }

  // Jika tidak ada data yang diupdate, kirim error
  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'Tidak ada data yang diupdate.' });
  }

  // Tambahkan ID pengguna sebagai parameter terakhir untuk klausa WHERE
  queryValues.push(id);

  // Gabungkan semua field menjadi satu query string
  const queryText = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${queryParamIndex} RETURNING id, username, email, avatar_url`;

  try {
    const result = await db.query(queryText, queryValues);
    res.status(200).json({ message: 'Profil berhasil diupdate', user: result.rows[0] });
  } catch (error) {
    console.error('Error saat update profil:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// =================================================================
// Fungsi untuk Menghapus Akun Pengguna
// =================================================================
exports.deleteMe = async (req, res) => {
  try {
    const { id } = req.user; // Ambil ID dari token

    await db.query('DELETE FROM users WHERE id = $1', [id]);

    res.status(200).json({ message: 'Akun berhasil dihapus.' });
  } catch (error) {
    console.error('Error saat menghapus akun:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};