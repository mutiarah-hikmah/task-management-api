const db = require('../config/db');

// =================================================================
// Fungsi untuk Membuat Tugas Baru
// =================================================================
exports.createTask = async (req, res) => {
  // Ambil semua data yang dibutuhkan dari body
  const { title, description, due_date, project_id, user_id } = req.body;

  // Validasi
  if (!title || !project_id || !user_id) {
    return res.status(400).json({ message: 'Title, project_id, dan user_id wajib diisi.' });
  }

  try {
    const queryText = 'INSERT INTO tasks (title, description, due_date, project_id, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const newTask = await db.query(queryText, [title, description, due_date, project_id, user_id]);

    res.status(201).json({ message: 'Tugas berhasil dibuat', task: newTask.rows[0] });
  } catch (error) {
    console.error('Error saat membuat tugas:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server, pastikan project_id dan user_id valid.' });
  }
};

exports.getAllTasks = async (req, res) => {
    // Bonus: kita buat agar bisa filter berdasarkan project_id jika ada di query URL
    // Contoh: /api/tasks?projectId=1
    const { projectId } = req.query;
    try {
        let query;
        if (projectId) {
            query = await db.query('SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC', [projectId]);
        } else {
            query = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
        }
        res.status(200).json(query.rows);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (task.rows.length === 0) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan.' });
        }
        res.status(200).json(task.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    // Status adalah field yang paling sering di-update
    const { title, description, status, due_date, user_id } = req.body;
    try {
        const queryText = `UPDATE tasks 
                           SET title = $1, description = $2, status = $3, due_date = $4, user_id = $5 
                           WHERE id = $6 RETURNING *`;
        const updatedTask = await db.query(queryText, [title, description, status, due_date, user_id, id]);
        if (updatedTask.rows.length === 0) {
            return res.status(404).json({ message: 'Tugas tidak ditemukan.' });
        }
        res.status(200).json({ message: 'Tugas berhasil diupdate', task: updatedTask.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM tasks WHERE id = $1', [id]);
        res.status(200).json({ message: 'Tugas berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};