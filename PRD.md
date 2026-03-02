# Product Requirement Document (PRD) - Platform Edukasi BISINDO

## 1. Ringkasan Proyek
Platform web edukasi untuk mempelajari abjad Bahasa Isyarat Indonesia (BISINDO) dari A-Z menggunakan deteksi gerakan tangan berbasis AI secara real-time.

## 2. Tech Stack & Arsitektur (Final Verified)
- **Frontend:** React.js (Vite), Tailwind CSS, MediaPipe Tasks-Vision.
- **Backend:** FastAPI (Python), SQLAlchemy (ORM), SQLite (Database).
- **AI Model:** PyTorch MLP (Multi-Layer Perceptron) dengan 126 fitur input (21 landmarks x 3 koordinat x 2 tangan).
- **Protokol Komunikasi:**
  - **REST API:** Untuk Autentikasi (JWT), Manajemen Progress, dan Riwayat Tes.
  - **WebSocket:** Untuk Inferensi AI Real-time (Low Latency).

## 3. Alur Kerja Sistem (AI Pipeline)
1. **Frontend** mengakses kamera via `navigator.mediaDevices.getUserMedia`.
2. **MediaPipe Hand Landmarker** (WASM) mengekstrak **World Landmarks (3D)** secara lokal di browser setiap ~150ms.
3. Koordinat dikirim dalam format JSON melalui **WebSocket** ke endpoint `/ws/predict`.
4. **Backend** menerima koordinat, melakukan normalisasi (wrist-centering & scaling), dan memasukkannya ke model PyTorch.
5. **Hasil Prediksi** (Huruf & Confidence Score) dikirim kembali ke Frontend via WebSocket.
6. **Frontend** memberikan feedback visual dan menyimpan progress ke Database jika akurasi mencapai ambang batas (>= 0.8).

## 4. Fitur Utama
- **Autentikasi:** Registrasi dan Login menggunakan JWT.
- **Modul Belajar:** Daftar abjad A-Z dengan panduan gambar/video.
- **Latihan Real-time:** Praktik langsung dengan kamera dan feedback AI instan.
- **Sistem Progress:** Mencatat huruf yang telah dikuasai dan skor tertinggi.
- **Riwayat Tes:** Laporan hasil tes untuk melihat perkembangan pengguna.

## 5. Kebutuhan Non-Fungsional & Optimasi
- **Latensi:** Target inferensi < 500ms (dicapai melalui WebSocket & Frame Dropping logic).
- **Stabilitas UI:** Penggunaan `requestAnimationFrame` dan pemuatan model MediaPipe secara asinkron (sekali muat).
- **Respon Server:** Backend menggunakan `load_bisindo_model` pada startup untuk menghindari delay *cold-start*.
- **Keamanan:** Proteksi route frontend dengan `AuthGuard` dan backend dengan dependensi `get_current_user`.

## 6. Struktur Data (Database Schema)
- `users`: id, username, password_hash.
- `user_progress`: id, user_id, letter, highest_confidence, is_mastered, updated_at.
- `test_history`: id, user_id, score, total_correct, total_questions, wrong_letters (JSON), created_at.
