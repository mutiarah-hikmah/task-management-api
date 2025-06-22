const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/tasks
// Membuat tugas baru
router.post('/', authMiddleware, taskController.createTask);

// Mendapatkan semua tugas (bisa juga spesifik per proyek)
router.get('/', authMiddleware, taskController.getAllTasks);

// Mendapatkan tugas berdasarkan ID
router.get('/:id', authMiddleware, taskController.getTaskById);

// Mengupdate tugas berdasarkan ID
router.put('/:id', authMiddleware, taskController.updateTask);

// Menghapus tugas berdasarkan ID
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;