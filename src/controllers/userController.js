const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field (username, email, password) wajib diisi' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const queryText = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email, username';
    const queryValues = [username, email, hashedPassword];
    const newUser = await db.query(queryText, queryValues);
    res.status(201).json({
      message: 'Pengguna berhasil didaftarkan!',
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error('Error saat registrasi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    res.status(200).json({
      message: 'Login berhasil!',
      token: token
    });

  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
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

exports.updateMe = async (req, res) => {
  const { id } = req.user; 
  const { username, password } = req.body;
  const updateFields = [];
  const queryValues = [];
  let queryParamIndex = 1;
  if (username) {
    updateFields.push(`username = $${queryParamIndex++}`);
    queryValues.push(username);
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    updateFields.push(`password = $${queryParamIndex++}`);
    queryValues.push(hashedPassword);
  }
  if (req.file) {
    const avatarUrl = req.file.path;
    updateFields.push(`avatar_url = $${queryParamIndex++}`);
    queryValues.push(avatarUrl);
  }
  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'Tidak ada data yang diupdate.' });
  }

  queryValues.push(id);
  const queryText = `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${queryParamIndex} RETURNING id, username, email, avatar_url`;
  try {
    const result = await db.query(queryText, queryValues);
    res.status(200).json({ message: 'Profil berhasil diupdate', user: result.rows[0] });
  } catch (error) {
    console.error('Error saat update profil:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    const { id } = req.user;

    await db.query('DELETE FROM users WHERE id = $1', [id]);

    res.status(200).json({ message: 'Akun berhasil dihapus.' });
  } catch (error) {
    console.error('Error saat menghapus akun:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};