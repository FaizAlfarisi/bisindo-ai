# Deployment Guide - BISINDO Platform

Ikuti langkah-langkah di bawah ini untuk mempublikasikan proyek ke Internet.

## 1. Database: Supabase (PostgreSQL)
1.  Buat akun di [Supabase](https://supabase.com/).
2.  Buat Project Baru (contoh: `bisindo-db`).
3.  Pergi ke **Project Settings** > **Database**.
4.  Cari bagian **Connection String** > **URI**.
5.  Salin URL tersebut. Formatnya akan seperti: `postgres://postgres.[ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`.
6.  Simpan URL ini untuk langkah Render.

---

## 2. Backend: Render (FastAPI)
1.  Buat akun di [Render](https://render.com/).
2.  Klik **New +** > **Web Service**.
3.  Hubungkan repositori GitHub Anda.
4.  Pilih direktori backend (jika diminta) atau set konfigurasi berikut:
    *   **Runtime:** `Python 3`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5.  Klik **Advanced** > **Add Environment Variable**:
    *   `DATABASE_URL`: (Tempel URL dari Supabase tadi)
    *   `FRONTEND_URL`: `https://your-app-name.vercel.app` (URL Vercel Anda nanti)
    *   `SECRET_KEY`: `Isi-dengan-string-acak-bebas-rahasia`
6.  Deploy! Setelah selesai, Render akan memberikan URL (contoh: `https://bisindo-api.onrender.com`).

---

## 3. Frontend: Vercel (React + Vite)
1.  Buat akun di [Vercel](https://vercel.com/).
2.  Klik **Add New** > **Project**.
3.  Hubungkan repositori GitHub Anda.
4.  Vercel akan mendeteksi Vite secara otomatis.
5.  Buka bagian **Environment Variables** dan tambahkan:
    *   `VITE_API_BASE_URL`: `https://bisindo-api.onrender.com` (Gunakan URL dari Render)
6.  Klik **Deploy**.

---

## Tips Penting:
*   **HTTPS:** Render dan Vercel secara otomatis menyediakan sertifikat SSL (HTTPS). Ini sangat penting karena fitur kamera tidak akan jalan di HTTP biasa.
*   **WebSockets:** Render mendukung WebSockets secara native di Web Services mereka. Pastikan `VITE_API_BASE_URL` di Vercel menggunakan `https://` (logika kode kita akan otomatis mengubahnya ke `wss://`).
*   **Model AI:** Karena Render (Free Tier) memiliki limit RAM 512MB, pastikan model PyTorch Anda tidak terlalu besar. Model MLP BISINDO saat ini seharusnya aman di bawah limit tersebut.
