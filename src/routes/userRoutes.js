// INI RUTE REGISTER :)
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // <-- IMPORT MIDDLEWARE
const upload = require('../middleware/uploadMiddleware'); // <-- IMPORT UPLOAD

// POST /api/users/register (Route untuk registrasi pengguna baru)
router.post('/register', userController.register);

// POST /api/users/login  (Rute untuk Login)
router.post('/login', userController.login);

// Rute Terproteksi (harus login dan mengirim token)
// GET /api/users/me
router.get('/me', authMiddleware, userController.getMe);

// Rute untuk update profil pengguna yang sedang login
// PUT /api/users/me
router.put('/me', authMiddleware, upload.single('avatar'), userController.updateMe);

// Rute untuk menghapus akun pengguna yang sedang login
// DELETE /api/users/me
router.delete('/me', authMiddleware, userController.deleteMe);

module.exports = router;
