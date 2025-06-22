const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Ambil token dari header 'Authorization'
  const authHeader = req.header('Authorization');

  // 2. Cek jika tidak ada token
  if (!authHeader) {
    return res.status(401).json({ message: 'Akses ditolak, tidak ada token.' });
  }

  try {
    // Token dikirim dengan format "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Format token salah.' });
    }

    // 3. Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Simpan payload token ke object request agar bisa dipakai di controller
    req.user = decoded.user;

    // 5. Lanjutkan ke proses selanjutnya (ke controller)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token tidak valid.' });
  }
};