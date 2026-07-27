# Deployment & Setup Guide (LOGISLOT)

Dokumen ini berisi panduan komprehensif untuk men-deploy aplikasi LogisSlot di lingkungan *local* maupun *production* menggunakan Docker.

## 1. Persiapan Awal
Pastikan server Anda sudah terinstal:
- **Git**
- **Docker** & **Docker Compose**
- **Node.js** v20+ (Opsional jika ingin menjalankan tanpa Docker)

### Clone Repository
Lakukan clone repositori dari GitHub:
```bash
git clone https://github.com/organization/logislot.git
cd logislot
```

## 2. Konfigurasi Environment (`.env`)
Salin file template `.env.example` menjadi `.env` di direktori root/backend.

```bash
cp backend/.env.example backend/.env
```

Buka file `.env` dan konfigurasikan variabel berikut:
- `PORT`: Port backend API berjalan (default: 5000).
- `DATABASE_URL`: URL koneksi ke PostgreSQL. Format: `postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public`.
- `REDIS_URL`: URL koneksi ke Redis. Format: `redis://HOST:PORT`.
- `JWT_SECRET`: Kunci rahasia untuk tanda tangan Access Token. Gunakan string acak 64 karakter.
- `JWT_REFRESH_SECRET`: Kunci rahasia untuk Refresh Token.
- `CLIENT_URL`: URL dari frontend untuk pengaturan CORS.

> [!WARNING]
> Jangan pernah membagikan `JWT_SECRET` atau `DATABASE_URL` di public repository. Selalu masukkan `.env` ke `.gitignore`.

## 3. Deployment menggunakan Docker Compose

Kami telah menyediakan file `docker-compose.yml` untuk mempermudah setup *full-stack* (Frontend, Backend, PostgreSQL, Redis, dan Nginx).

Jalankan perintah berikut di root folder project:
```bash
docker-compose up -d --build
```
*Perintah ini akan men-download image database dan cache, lalu mem-build image untuk aplikasi frontend dan backend.*

### Menjalankan Migrasi Database di Production
Karena ini adalah deployment pertama, skema database belum terbentuk di PostgreSQL. Anda harus menjalankan Prisma migration dari dalam container backend.

```bash
# Masuk ke container backend
docker-compose exec backend sh

# Jalankan prisma push (membuat tabel jika belum ada)
npx prisma db push

# (Opsional) Jalankan seed data admin pertama
npm run seed

# Keluar dari container
exit
```

> [!TIP]
> Jika Anda memiliki file migrasi SQL formal, gunakan `npx prisma migrate deploy` di production. Gunakan `db push` hanya untuk sinkronisasi paksa skema.

## 4. Konfigurasi Reverse Proxy (Nginx + SSL)
Dalam production, direkomendasikan untuk menaruh Nginx di depan aplikasi sebagai *Reverse Proxy* dan mengatur sertifikat SSL (HTTPS).

Contoh konfigurasi `/etc/nginx/sites-available/logislot`:

```nginx
server {
    listen 80;
    server_name logislot.example.com;

    # Redirect HTTP ke HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name logislot.example.com;

    ssl_certificate /etc/letsencrypt/live/logislot.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/logislot.example.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket (Socket.io)
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Pastikan Anda melakukan *restart* Nginx setelah menyimpan konfigurasi: `sudo systemctl restart nginx`.
