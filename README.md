# (MY-BACKEND-APP) Task Management API

API ini adalah backend untuk aplikasi manajemen tugas. Dibuat menggunakan Node.js, Express, dan PostgreSQL, API ini menyediakan fungsionalitas untuk manajemen pengguna, proyek, dan tugas, serta dilengkapi dengan sistem otentikasi berbasis JWT.

---

## 1. Panduan untuk Developer 

Bagian ini menjelaskan cara menjalankan proyek ini di lingkungan development lokal.

### Teknologi yang Digunakan
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Otentikasi:** JSON Web Token (JWT)
* **Lain-lain:** bcryptjs, multer, dotenv, cors

### Cara Setup dan Instalasi
Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone Repository**
    ```bash
    git clone (https://github.com/mutiarah-hikmah/task-management-api)
    cd nama-repo
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variable**
    Buat file `.env` di direktori utama proyek dan isi dengan variabel yang dibutuhkan. Salin dari contoh di bawah ini dan sesuaikan nilainya.
    ```
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASSWORD=password_database_anda
    DB_PORT=5432
    DB_NAME=task_management_app
    JWT_SECRET=ini_ya
    ```

4.  **Setup Database**
    Pastikan PostgreSQL server sudah berjalan. Buat database dengan nama yang sesuai dengan `DB_NAME` di atas, lalu jalankan skrip SQL di bawah ini untuk membuat tabel-tabel yang diperlukan.
    ```sql
    -- Salin dan tempel skrip CREATE TABLE users, projects, dan tasks di sini
    CREATE TABLE users (...);
    CREATE TABLE projects (...);
    CREATE TABLE tasks (...);
    ```

5.  **Jalankan Server**
    ```bash
    node index.js
    ```
    Server akan berjalan di `http://localhost:3000`.

---

## 2. Panduan Penggunaan API 

Berikut adalah daftar endpoint yang tersedia dan cara menggunakannya.
**Base URL:** `http://localhost:3000`

### Autentikasi & Pengguna (`/api/users`)

#### `POST /api/users/register`
- **Deskripsi:** Mendaftarkan pengguna baru.
- **Otentikasi:** Tidak diperlukan.
- **Request Body (JSON):**
  ```json
  {
    "username": "budi",
    "email": "budi@example.com",
    "password": "password123"
  }
- **Success Response (201 Created):**
  ```json
  {
    "message": "Pengguna berhasil didaftarkan!",
    "user": {
        "id": 1,
        "email": "budi@example.com",
        "username": "budi"
    }
  }

#### `POST /api/users/login`
- **Deskripsi:** Melakukan login untuk mendapatkan token otentikasi (JWT).
- **Otentikasi:** Tidak diperlukan.
- **Request Body (JSON):**
  ```json
  {
    "email": "tester@example.com",
    "password": "password123"
  }
- **Success Response (200 OK):**
  ```json
  {
    "message": "Login berhasil!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }

#### `GET /api/users/me`
- **Deskripsi:** Mengambil detail profil dari pengguna yang sedang login.
- **Otentikasi:** Kirim token JWT sebagai Bearer Token di header Authorization
- **Success Response (200 OK):**
  ```json
  {
    "id": 1,
    "username": "budi",
    "email": "budi@example.com",
    "avatar_url": null
  }
- **Error Response (401 Unauthorized):**
  ```json
  {
    "message": "Akses ditolak, tidak ada token."
  }

#### `PUT /api/users/me`
- **Deskripsi:** Mengupdate detail profil (username, password, avatar) dari pengguna yang sedang login.
- **Otentikasi:** Diperlukan (Bearer Token)
- **Request Body (multipart/form-data):**
  | Field | Tipe | Deskripsi | Wajib | | :--- | :--- | :--- | :--- | | username| string | Nama pengguna baru. | Tidak | | password| string | Password baru. | Tidak | | avatar | file | File gambar (jpeg/png). | Tidak |
- **Success Response (200 OK):**
  ```json
  {
    "message": "Profil berhasil diupdate",
    "user": {
        "id": 1,
        "username": "budi_updated",
        "email": "budi@example.com",
        "avatar_url": "uploads/avatar-12345.jpg"
    }
  }

#### `DELETE /api/users/me`
- **Deskripsi:** Menghapus akun dari pengguna yang sedang login.
- **Otentikasi:** Diperlukan (Bearer Token)
- **Success Response (200 OK):**
  ```json
  {
    "message": "Akun berhasil dihapus."
  }

### Proyek (`/api/projects`)

#### `POST /api/projects`
- **Deskripsi:** Membuat proyek baru.
- **Otentikasi:** Diperlukan (Bearer Token)
- **Request Body (application/json):**
  | Field | Tipe | Deskripsi | Wajib | | :--- | :--- | :--- | :--- | | name | string | Nama proyek. | Ya | | description| string | Deskripsi singkat proyek. | Tidak |
- **Success Response (201 Created):**
  ```json
  {
    "message": "Proyek berhasil dibuat",
    "project": { "id": 1, "name": "Proyek Baru", "description": "Deskripsi proyek.", ... }
  }

#### `GET /api/projects`
- **Deskripsi:** Mendapatkan daftar semua proyek.
- **Otentikasi:** Diperlukan (Bearer Token)
- **Success Response (200 OK):**
  ```json
  [
    { "id": 1, "name": "Proyek Baru", ... },
    { "id": 2, "name": "Proyek Lain", ... }
  ]

#### `GET /api/projects/:id`
- **Deskripsi:** Mendapatkan detail satu proyek berdasarkan ID-nya.
- **Otentikasi:** Diperlukan (Bearer Token)
- **URL Parameter:**
  | Name | Tipe | Deskripsi | | :--- | :--- | :--- | | id | integer| ID unik dari proyek. |
- **Success Response (200 OK):**
  ```json
  { "id": 1, "name": "Proyek Baru", "description": "Deskripsi proyek.", ... }

#### `PUT /api/projects/:id`
- **Deskripsi:** Mengupdate proyek berdasarkan ID
- **Otentikasi:** Diperlukan (Bearer Token)
- **URL Parameter:** id proyek yang akan diupdate.
- **Request Body (application/json):**
  ```json
  {
    "name": "Nama Proyek (Updated)",
    "description": "Deskripsi baru."
  }
- **Success Response (200 OK):**
  ```json
  {
    "message": "Proyek berhasil diupdate",
    "project": { "id": 1, "name": "Nama Proyek (Updated)", ... }
  }

#### `DELETE /api/projects/:id`
- **Deskripsi:** Menghapus proyek berdasarkan ID. (Akan menghapus semua tugas di dalamnya).
- **Otentikasi:** Diperlukan (Bearer Token)
- **URL Parameter:** id proyek yang akan dihapus
- **Success Response (200 OK):**
  ```json
  {
    "message": "Proyek berhasil dihapus."
  }

### Tugas (`/api/tasks`)

#### `POST /api/tasks`
- **Deskripsi:** Membuat tugas baru di dalam sebuah proyek.
- **Otentikasi:** Diperlukan (Bearer Token)
- **Request Body (application/json):**
  | Field | Tipe | Deskripsi | Wajib | | :--- | :--- | :--- | :--- | | title | string | Judul tugas. | Ya | | description| string | Deskripsi detail tugas. | Tidak | | due_date | string | Tanggal tenggat (format: YYYY-MM-DD).| Tidak | | project_id| integer| ID proyek tempat tugas ini berada. | Ya | | user_id | integer| ID pengguna yang ditugaskan. | Ya |
- **Success Response (201 Created):**
  ```json
  {
    "message": "Tugas berhasil dibuat",
    "task": { "id": 1, "title": "Desain Halaman Login", ... }
  }

#### `GET /api/tasks`
- **Deskripsi:** Mendapatkan daftar semua tugas. Bisa difilter berdasarkan proyek.
- **Otentikasi:** Diperlukan (Bearer Token)
- **Query Parameter (Opsional)**
  | Name | Tipe | Deskripsi | | :--- | :--- | :--- | | projectId| integer| Filter tugas untuk ID proyek tertentu. |
- **Contoh URL:** /api/tasks?projectId=1
- **Success Response (200 OK):**
  ```json
  [
    { "id": 1, "title": "Desain Halaman Login", "project_id": 1, ... },
    { "id": 2, "title": "Buat API Otentikasi", "project_id": 1, ... }
  ]

#### `PUT /api/tasks/:id`
- **Deskripsi:** Mengupdate tugas (misal: mengubah status).
- **Otentikasi:** Diperlukan (Bearer Token)
- **URL Parameter:** id tugas yang akan diupdate.
- **Request Body (application/json):**
  ```json
  {
    "title": "Desain Halaman Login (Final)",
    "description": "...",
    "status": "done",
    "due_date": "2025-08-30",
    "user_id": 1
  }
- **Success Response (200 OK):**
  ```json
  {
    "message": "Tugas berhasil diupdate",
    "task": { "id": 1, "status": "done", ... }
  }

#### `DELETE /api/tasks/:id`
- **Deskripsi:** Menghapus tugas berdasarkan ID
- **Otentikasi:** Diperlukan (Bearer Token)
- **URL Parameter:** id tugas yang akan dihapus.
- **Success Response (200 OK):**
  ```json
  {
    "message": "Tugas berhasil dihapus."
  }
