# Platform Edukasi BISINDO

## 1. Visi Produk
Platform web edukasi interaktif untuk pembelajaran huruf BISINDO (A-Z). Sistem difokuskan pada alur edukasi yang lugas: Belajar -> Praktik -> Tes. Target pengguna adalah pelajar, guru, dan masyarakat umum.

## 2. Fitur Utama Sistem
- **Modul Pembelajaran:** Grid interaktif huruf A-Z. Berisi gambar gerakan, video pendek (3-5 detik), deskripsi posisi tangan, dan tombol "Mulai Praktik".
- **Mode Praktik Realtime:** Frontend mengakses kamera (WebRTC). Layar menampilkan huruf target dan *confidence score* secara real-time. Status: >=80% (Benar), 60-79% (Cukup), <60% (Salah).
- **Mode Latihan Bebas:** Sistem memilih huruf secara acak untuk dipraktikkan oleh pengguna.
- **Mode Tes:** 10 huruf acak, 3-5 detik per huruf tanpa petunjuk visual. Menampilkan evaluasi (huruf yang salah, rekomendasi latihan, dan skor akhir).
- **Sistem User (Auth):** Register dan Login sederhana. Menyimpan riwayat progres belajar (huruf yang sudah dipelajari) dan riwayat skor tes.

## 3. Arsitektur Teknis
- **Frontend:** React (Vite) + Tailwind CSS.
- **Backend:** FastAPI (Python). Menangani endpoint API standar dan endpoint AI.
- **Database:** SQLite. Schema difokuskan pada tabel `Users`, `Progress`, dan `Test_Results`.
- **Model AI:** Menggunakan arsitektur MLP (`bisindo_model.pth`).

## 4. Kebutuhan Non-Fungsional & Batasan
- **Privasi:** TIDAK menyimpan video user di server maupun lokal. Hanya skor dan data teks yang disimpan.
- **Performa:** Delay deteksi kamera ke hasil < 1 detik. Akurasi deteksi model >= 80%.
- **Responsif:** UI harus rapi dibuka di Desktop maupun Laptop.
- **Out of Scope (JANGAN DIBUAT):** Deteksi kata/kalimat, avatar 3D, gamifikasi kompleks, leaderboard, fitur sosial, integrasi eksternal.