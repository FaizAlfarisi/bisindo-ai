# Product Requirements Document (PRD)
**Project Name:** BISINDO Interactive Learning Platform
**Objective:** Platform web edukasi interaktif untuk pembelajaran huruf BISINDO (A-Z) dengan alur Belajar -> Praktik -> Tes yang responsif dan berkinerja tinggi.

## 1. Arsitektur & Tech Stack
- **Frontend (FE):** React.js (Vite) + Tailwind CSS.
- **Client-Side AI:** MediaPipe (Hands) JS API untuk ekstraksi landmark tangan langsung di browser.
- **Backend (BE):** FastAPI (Python) + Uvicorn. Menangani REST API dan Inferensi AI.
- **Database:** SQLite dengan ORM SQLAlchemy.
- **AI Model:** PyTorch MLP (`bisindo_model.pth`).

## 2. Fitur & UI/UX Flow
### 2.1 Halaman & Rute (React Router)
- `/login` & `/register`: Autentikasi pengguna dengan JWT.
- `/dashboard`: Halaman beranda setelah login, menampilkan ringkasan progres dan akses cepat ke Belajar/Tes.
- `/learn`: Menampilkan grid huruf A-Z.
- `/learn/[letter]`: Halaman detail huruf (Gambar petunjuk, deskripsi posisi jari, dan tombol "Mulai Praktik").
- `/practice/[letter]`: UI Kamera aktif dengan WebRTC. Menampilkan panduan (ghost image/deskripsi) dan feedback visual real-time.
- `/test`: Mode ujian dengan 10 soal acak, dibatasi waktu (contoh: 3-5 detik per soal).
- `/history`: Riwayat tes dan skor.

### 2.2 Kriteria Penerimaan (Acceptance Criteria)
- **Praktik Realtime:**
  - Aplikasi meminta izin kamera.
  - MediaPipe mendeteksi tangan dan menggambar bounding box/skeleton tangan.
  - Feedback UI dinamis: Skor >=80% (Hijau/Benar), 60-79% (Kuning/Cukup), <60% (Merah/Salah).
- **Mode Tes:** 10 huruf acak. Timer 3-5 detik per huruf. Hasil mencatat tingkat akurasi dan daftar huruf yang salah.
- **Performa:** Waktu respons dari kamera hingga muncul hasil prediksi (latency) harus kurang dari 1 detik.

## 3. Alur Data AI & Optimalisasi Latency
Untuk mencapai target latensi < 1 detik:
1. **FE:** Menangkap frame kamera (30 FPS).
2. **FE (MediaPipe):** Mengekstrak 21 titik koordinat tangan (x, y, z) per frame secara lokal.
3. **FE (Throttling):** FE tidak mengirim setiap frame. Pengiriman ke backend dibatasi (throttle) sekitar 5-10 request per detik.
4. **FE -> BE:** Mengirim array koordinat (63 nilai float) via HTTP POST `/api/predict`.
5. **BE:** FastAPI memproses koordinat dengan model `bisindo_model.pth`.
6. **BE -> FE:** Mengembalikan JSON `{ "letter": "A", "confidence": 0.85 }`.
7. **FE:** Memperbarui UI feedback (Warna dan Skor) tanpa re-render keseluruhan halaman.

## 4. Desain Skema Database (SQLAlchemy)
### Tabel `users`
- `id` (Integer, Primary Key)
- `username` (String, Unique, Indexed)
- `password_hash` (String)
- `created_at` (DateTime)

### Tabel `user_progress` (Melacak penguasaan per huruf)
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key ke `users.id`)
- `letter` (String(1)) - Huruf A-Z
- `highest_confidence` (Float) - Skor tertinggi saat praktik
- `is_mastered` (Boolean) - True jika skor > 80%
- `updated_at` (DateTime)

### Tabel `test_history` (Riwayat hasil ujian)
- `id` (Integer, Primary Key)
- `user_id` (Integer, Foreign Key ke `users.id`)
- `score` (Float) - Persentase jawaban benar
- `total_correct` (Integer)
- `total_questions` (Integer)
- `wrong_letters` (JSON/Text) - Array huruf yang dijawab salah
- `created_at` (DateTime)

## 5. API Endpoints (FastAPI)
- **Auth:**
  - `POST /api/auth/register`
  - `POST /api/auth/login` (Returns JWT)
- **Progress & History:**
  - `GET /api/progress` (Daftar progres per huruf)
  - `GET /api/tests` (Riwayat ujian user)
  - `POST /api/tests` (Simpan hasil tes baru)
- **AI Inference:**
  - `POST /api/predict` (Input: 21 Landmarks x,y,z | Output: Prediksi huruf & confidence)

## 6. Roadmap & Fase Pengembangan
- **Phase 1: Project Scaffolding.** Setup Vite (React) dan FastAPI (Python venv). Konfigurasi struktur folder.
- **Phase 2: Database & Auth.** Implementasi model SQLAlchemy, JWT auth, dan endpoint CRUD. Setup koneksi SQLite.
- **Phase 3: Core UI & Learning Module.** Slicing UI (Tailwind) untuk routing dasar, Dashboard, Grid Huruf, dan Detail Huruf.
- **Phase 4: AI & WebRTC Integration (Krusial).** Integrasi MediaPipe JS di FE. Integrasi `bisindo_model.pth` di BE. Endpoint `/api/predict`.
- **Phase 5: Practice & Test Mode.** Logika penilaian real-time UI, timer ujian, perhitungan akurasi, dan simpan hasil tes.
- **Phase 6: Polish & Integrasi Akhir.** Penyesuaian UI/UX, optimasi latensi throttle API, handling error jaringan dan kamera.

## 7. Batasan Sistem (Constraints)
- Platform TIDAK mengirimkan gambar/video ke backend. Hanya mentransmisikan data angka (koordinat 3D) untuk menjaga privasi ketat dan latensi rendah.
- Fokus platform berbasis Web (Desktop & Mobile Browser modern yang mendukung WebRTC/WebGL).
