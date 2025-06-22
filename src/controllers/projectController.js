const db = require('../config/db');

// =================================================================
// Fungsi untuk Membuat Proyek Baru
// =================================================================
exports.createProject = async (req, res) => {
  // Ambil data dari body request
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nama proyek wajib diisi.' });
  }

  try {
    const queryText = 'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *';
    const newProject = await db.query(queryText, [name, description]);

    res.status(201).json({ message: 'Proyek berhasil dibuat', project: newProject.rows[0] });
  } catch (error) {
    console.error('Error saat membuat proyek:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// =================================================================
// Fungsi untuk Mendapatkan SEMUA Proyek
// =================================================================
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.status(200).json(projects.rows);
  } catch (error) {
    console.error('Error saat mengambil semua proyek:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// =================================================================
// Fungsi untuk Mendapatkan Proyek Berdasarkan ID
// =================================================================
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.query('SELECT * FROM projects WHERE id = $1', [id]);

    if (project.rows.length === 0) {
      return res.status(404).json({ message: 'Proyek tidak ditemukan.' });
    }
    res.status(200).json(project.rows[0]);
  } catch (error) {
    console.error('Error saat mengambil proyek by ID:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// =================================================================
// Fungsi untuk Mengupdate Proyek
// =================================================================
exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name && !description) {
        return res.status(400).json({ message: 'Setidaknya satu field (name atau description) harus diisi.' });
    }

    // Untuk sementara, kita buat update sederhana.
    // Kamu bisa kembangkan jadi dinamis seperti update user jika mau.
    try {
        const queryText = 'UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING *';
        const updatedProject = await db.query(queryText, [name, description, id]);

        if (updatedProject.rows.length === 0) {
            return res.status(404).json({ message: 'Proyek tidak ditemukan.' });
        }
        res.status(200).json({ message: 'Proyek berhasil diupdate', project: updatedProject.rows[0] });
    } catch (error) {
        console.error('Error saat mengupdate proyek:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// =================================================================
// Fungsi untuk Menghapus Proyek
// =================================================================
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM projects WHERE id = $1', [id]);
        res.status(200).json({ message: 'Proyek berhasil dihapus.' });
    } catch (error) {
        // Ingat, jika ada tugas yang terhubung ke proyek ini, mereka akan ikut terhapus (ON DELETE CASCADE)
        console.error('Error saat menghapus proyek:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};