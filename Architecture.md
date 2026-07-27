# Arsitektur Sistem - LOGISLOT

## Diagram Arsitektur (Deskriptif)
Sistem menggunakan pola *Client-Server* dengan arsitektur monolitik modular untuk backend dan SPA/SSR untuk frontend, didukung komunikasi asinkron real-time via WebSocket.

```text
[ Client (Browser / Mobile Browser) ]
  |  (HTTPS/REST)   (WSS/WebSocket)
  v                   v
[ Nginx (Reverse Proxy & SSL Termination) ] -- Rate Limiting & CORS
  |                   |
  v                   v
[ Backend API (Node.js/Express) ]
  |                   |
  |---[ Authentication (JWT/Bcrypt) ]
  |---[ Business Logic (REST CRUD) ]
  |---[ WebSocket Server (Socket.io) ]
  |                   |
  v                   v
[ Database (PostgreSQL) ] <--> [ Cache/Session (Redis) ]
```

## Tech Stack & Alasan Pemilihan
- **Frontend:** React.js (Next.js) + Tailwind CSS.
  - *Alasan:* Next.js memungkinkan render yang cepat dan SEO-friendly jika dibutuhkan, struktur folder jelas, dan Tailwind mempercepat styling UI yang seragam dan responsif (desktop, tablet, mobile).
- **Backend:** Node.js dengan Express.
  - *Alasan:* Ringan, performa I/O non-blocking tinggi (cocok untuk 200ms SLA), dukungan pustaka ekstensif, mudah diintegrasikan dengan WebSocket.
- **Database:** PostgreSQL.
  - *Alasan:* Relational, memiliki transaksi ACID yang ketat (penting untuk Serializable isolation level guna mencegah double-booking), handal untuk data transaksional.
- **Cache & Real-time Session:** Redis.
  - *Alasan:* Latency sangat rendah untuk menyimpan session sementara dan mengelola state WebSocket (terutama jika instance backend di-scale/clustering nantinya).
- **Real-time Engine:** WebSocket (Socket.io).
  - *Alasan:* Komunikasi dua arah persisten, sangat efisien untuk mem-broadcast perubahan status truk (arrived, unloading) dengan latency < 1 detik.

## Pola Komunikasi
- **RESTful API:** Digunakan untuk mayoritas operasi (Create, Read, Update, Delete) seperti login, submit booking, ambil data master, dan update status.
- **WebSocket:** Dedicated untuk broadcast *read-only event* secara live ke dashboard (contoh: notifikasi truk masuk gerbang, perubahan status loading dock).

## Strategi Keamanan
- **Autentikasi & Otorisasi:** JWT dengan pemisahan Access Token (short-lived) dan Refresh Token (httpOnly cookie/secure). Role-based access control (RBAC).
- **Enkripsi Kata Sandi:** Menggunakan bcrypt (atau Argon2) dengan salt untuk hashing password.
- **Transport Security:** Wajib HTTPS/TLS 1.3 (Sertifikat SSL dikelola Nginx/Gateway).
- **Proteksi Jaringan:** Aturan CORS ketat (hanya domain frontend yang diizinkan), Helmet.js untuk header HTTP security.
- **Rate Limiting:** Diterapkan secara umum dan ekstra ketat di endpoint gerbang (check-in/check-out) dan endpoint login untuk mencegah brute force.
