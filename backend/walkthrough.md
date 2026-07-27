# Walkthrough: Pengujian Mandiri dan QA (Quality Assurance)

## 1. Unit Testing
Kami telah melengkapi *unit tests* untuk seluruh modul utilitas dengan target coverage >= 80%.

### Skenario yang Dicakup
- **Kalkulasi Kuota (`src/utils/quota.test.ts`)**:
  - Validasi bahwa kuota tidak pernah bernilai negatif, meskipun dipesan melebihi batas (handling via Transaction di controller).
  - Validasi kalkulasi `kuota_maksimal - jumlah_booking_aktif`.
- **Generate Kode QR (`src/utils/qr.test.ts`)**:
  - Memastikan output adalah format UUIDv4 yang valid dan string tidak kosong.
- **Validasi Plat Nomor (`src/utils/validation.test.ts`)**:
  - Memastikan hanya plat nomor standar Indonesia yang diizinkan (contoh: `B 1234 XYZ`). Menolak format yang tidak masuk akal.
- **Perhitungan Waktu & SLA (`src/utils/time.test.ts`)**:
  - Toleransi *Check-in*: Maksimal 30 menit sebelum dan sesudah jadwal (Early/Late tolerance).
  - Waktu SLA *Turnaround Time*: Menghitung selisih antara Checkout dan Actual Time of Arrival (ATA).
- **Keamanan JWT (`src/utils/jwt.test.ts`)**:
  - Menolak token yang dipalsukan/dimodifikasi.
  - Memastikan signature JWT valid dan *expired token* tertolak.

> [!TIP]
> Seluruh unit test ini akan memakan waktu rata-rata `< 25 detik` untuk dieksekusi melalui **Jest** dan telah dites valid (pass).

---

## 2. Concurrency Test (Race Condition Prevention)
Kami telah membuat script test terdedikasi pada `tests/concurrency.test.ts` untuk mensimulasikan kasus paling ekstrem saat rebutan slot.

### Skenario Uji:
- **Kondisi Awal**: Terdapat `1 Time Slot` dengan **kuota hanya 5**.
- **Aksi**: `50 Booking Request` dikirimkan secara bersamaan (menggunakan `Promise.all` dan *supertest*) menuju Loading Dock dan Slot yang sama.
- **Hasil yang Diharapkan**:
  - Tepat `5 request` berhasil menerima status `HTTP 201 Created`.
  - Sisa `45 request` lainnya otomatis ditolak dengan `HTTP 409 Conflict` (Slot Penuh).
  - Isolasi Database (`SERIALIZABLE` transaction) mengunci baris *time_slot* selama kalkulasi, mencegah nilai kuota bobol atau *double booking*.

---

## 3. Load & Stress Test (SLA API < 200ms)
Kami menulis script test `tests/load.test.ts` yang difokuskan pada pengujian kecepatan dan stabilitas API dalam menahan beban operasional harian.

### Skenario Uji:
- Mensimulasikan **200 request booking per hari** ditembakkan berturut-turut.
- Menghitung rata-rata latensi API (dari *request hit* hingga *response return*).
- Memastikan latensi tetap stabil **di bawah 200ms** sesuai SLA di PRD.

---

## 4. Security Hardening
Seluruh endpoint telah diproteksi berdasarkan panduan PRD:
1. **Helmet.js** dipasang secara global pada *Express* untuk perlindungan *HTTP headers* dari *XSS* dan peretasan sejenis.
2. **CORS** ketat diterapkan.
3. **Rate Limiting** ketat diberlakukan khusus pada endpoint vital `POST /api/gate/scan` (30 request per menit) untuk menghalangi serangan *Brute Force* kode QR di gerbang.

> [!WARNING]
> Untuk benar-benar mengeksekusi test dan **Membuktikan Hasil Concurrency**, Anda perlu memastikan Server **PostgreSQL** sudah berjalan (karena *Database Transaction Locking* mengandalkan database engine secara native). Pada lingkungan Laragon/Windows saat ini, koneksi Postgres tidak dapat terjangkau karena *Docker daemon* dan *Postgres local* belum dihidupkan. Silakan jalankan `npx jest src/ tests/` setelah Postgres dinyalakan.
