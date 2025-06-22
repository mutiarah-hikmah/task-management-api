const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/projects
// Membuat proyek baru (terproteksi, harus login)
router.post('/', authMiddleware, projectController.createProject);

/// Mendapatkan semua proyek
router.get('/', authMiddleware, projectController.getAllProjects);

// Mendapatkan proyek berdasarkan ID
router.get('/:id', authMiddleware, projectController.getProjectById);

// Mengupdate proyek berdasarkan ID
router.put('/:id', authMiddleware, projectController.updateProject);

// Menghapus proyek berdasarkan ID
router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router;