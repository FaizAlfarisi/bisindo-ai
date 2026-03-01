# Product Requirements Document (PRD)
**Project Name:** BISINDO Interactive Learning Platform
**Objective:** Platform web edukasi interaktif untuk pembelajaran huruf BISINDO (A-Z) dengan alur Belajar -> Praktik -> Tes.

## 1. Arsitektur & Tech Stack
- **Frontend (FE):** React.js (Vite) + Tailwind CSS + MediaPipe (untuk deteksi landmark tangan di browser).
- **Backend (BE):** FastAPI (Python) + Uvicorn. Menangani API dan Inferensi AI.
- **Database:** SQLite + SQLAlchemy.
- **AI Model:** PyTorch MLP (`bisindo_model.pth`).

## 2. Alur Data AI (Krusial untuk Latency < 1s)
1. **FE:** Mengakses WebRTC kamera.
2. **FE:** Menjalankan MediaPipe JS mengekstrak koordinat tangan (x, y, z) dari frame.
3. **FE -> BE:** Mengirim array koordinat (JSON) via endpoint POST `/api/predict`.
4. **BE:** Memasukkan koordinat ke `bisindo_model.pth`.
5. **BE -> FE:** Mengembalikan JSON `{ "letter": "A", "confidence": 0.85 }`.
6. **FE:** Menampilkan UI feedback secara real-time.

## 3. Fitur & Kriteria Penerimaan (Acceptance Criteria)
- **Modul Pembelajaran:** Menampilkan grid A-Z. Klik huruf -> Muncul modal/halaman detail (gambar, video 3s, deskripsi, tombol praktik).
- **Praktik Realtime:** UI kamera menampilkan bounding box/status. Skor >=80% (Hijau/Benar), 60-79% (Kuning/Cukup), <60% (Merah/Salah).
- **Mode Tes:** 10 huruf acak. Timer 3-5 detik per huruf. Hasil akhir mencatat akurasi dan huruf yang perlu dipelajari ulang.
- **Autentikasi:** Register & Login berbasis JWT (JSON Web Token) sederhana.

## 4. Skema Database (High-Level)
- `users`: id, username, password_hash.
- `progress`: id, user_id, learned_letters (JSON/Array of strings).
- `test_history`: id, user_id, score, wrong_letters (JSON), created_at.

## 5. Roadmap & Fase Pengembangan (Vibe Coding Phases)
- **Phase 1: Project Scaffolding.** Setup Vite (FE) dan FastAPI venv (BE). Setup routing dasar.
- **Phase 2: Database & Auth.** Setup SQLite, SQLAlchemy, dan endpoint login/register.
- **Phase 3: Core UI & Learning Module.** Slicing UI Tailwind untuk Grid Huruf dan navigasi.
- **Phase 4: AI & WebRTC Integration.** Setup MediaPipe di FE, setup load `.pth` model di BE, dan integrasi API prediksi.
- **Phase 5: Test Mode & Final Polish.** Logika mode tes, timer, dan penyimpanan skor.

## 6. Batasan Sistem
- TIDAK menyimpan file video/gambar dari user (Privasi ketat).
- Fokus A-Z saja, tanpa fitur sosial atau gamifikasi kompleks.