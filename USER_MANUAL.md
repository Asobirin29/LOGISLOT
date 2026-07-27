# Panduan Pengguna & SOP Operasional (USER MANUAL)

Dokumen ini adalah panduan langkah demi langkah (Standard Operating Procedure) untuk menggunakan Sistem Manajemen Antrean Bongkar Muat (LogisSlot). 

---

## 1. Panduan Khusus Pos Gerbang (Security)

Tugas utama Security adalah memvalidasi kedatangan (Check-in) dan kepulangan (Check-out) truk menggunakan Scanner QR Code (HP/Tablet).

### Langkah Check-in Truk (Kedatangan)
1. Buka halaman **Dashboard Security** di HP/Tablet Anda.
2. Ketuk tombol **Scan QR Code**.
3. Arahkan kamera ke layar HP atau tiket kertas yang ditunjukkan oleh Sopir Truk.
4. *[Tempatkan Screenshot Kamera Scanner di sini]*
5. Jika berhasil discan, sistem akan menampilkan data truk dan pop-up berwarna:
   - **HIJAU (Tepat Waktu)**: Truk datang sesuai toleransi waktu. Persilakan truk masuk dan menunggu di area parkir (Queue).
   - **KUNING (Terlalu Awal/Terlambat)**: Truk datang di luar toleransi 30 menit. Anda akan melihat peringatan di layar. Hubungi IC (Inventory Control) jika ragu, atau tetap persilakan masuk jika SOP mengizinkan.
   - **MERAH (Ditolak)**: QR Code tidak valid atau bukan jadwalnya hari ini. **Tolak truk masuk.**
6. Klik **Konfirmasi Check-In**. Status truk otomatis berubah menjadi *Arrived*.

### Langkah Check-out Truk (Kepulangan)
1. Saat truk keluar dari area pabrik menuju gerbang keluar, ketuk kembali tombol **Scan QR Code**.
2. Scan QR dari sopir. 
3. Sistem akan memverifikasi apakah status bongkar muat sudah selesai (Completed).
4. Jika layar berwarna **HIJAU**, tekan **Konfirmasi Check-Out**. Gerbang terbuka, truk boleh pergi.
5. Jika layar **MERAH** (Belum selesai di gudang), **Tahan truk** dan minta sopir menyelesaikan administrasi dengan tim Gudang.

---

## 2. Panduan Khusus Operator Gudang (Warehouse)

Tugas tim Gudang adalah memanggil truk dari area parkir (Queue) menuju Loading Dock, serta mencatat waktu mulai dan selesai bongkar muat.

### Langkah Memanggil Truk ke Dock (Assign Dock)
1. Buka halaman **Dashboard Gudang (Warehouse)** di PC atau Tablet Anda.
2. Anda akan melihat daftar truk yang sedang mengantre (Status: *Arrived*). Truk yang memiliki label **URGENT** akan berada di paling atas.
3. *[Tempatkan Screenshot Antrean Gudang di sini]*
4. Klik tombol **Panggil Truk** pada truk yang berada di urutan teratas.
5. Pilih **Loading Dock** yang kosong dari menu *dropdown*.
6. Layar pengumuman (FIDS) di area parkir otomatis memanggil plat nomor tersebut untuk menuju Dock yang dipilih.

### Langkah Memulai Bongkar Muat (Start Unloading)
1. Saat truk sudah merapat ke Loading Dock, temui sopir.
2. Pada baris data truk tersebut di dashboard Anda, klik tombol **Mulai Bongkar** (Start Unloading).
3. Status berubah dari *Assigned* menjadi *Unloading*. Sistem otomatis mencatat waktu (Timestamp).

### Langkah Menyelesaikan Bongkar Muat (Complete)
1. Setelah fisik barang selesai diturunkan dan diverifikasi kesesuaiannya dengan nomor PO, kembali ke dashboard.
2. Klik tombol **Selesai** (Complete).
3. (Opsional) Masukkan catatan jika ada selisih barang (kekurangan/kerusakan).
4. Truk sekarang diizinkan untuk pulang melalui gerbang (*Check-out*).

---

## 3. Panduan Singkat untuk Supplier (Vendor)

Tugas Supplier adalah melakukan pendaftaran jadwal (Booking) maksimal 1 hari sebelum kedatangan (H-1 sebelum jam 15:00 WIB).

### Cara Mendaftar Jadwal (Booking Slot)
1. Login menggunakan akun Supplier Anda.
2. Buka menu **Buat Booking**.
3. Pilih **Tanggal Kedatangan**. (Perhatian: Anda tidak bisa memilih tanggal hari ini. Untuk besok, booking harus dilakukan sebelum jam 15:00 WIB hari ini).
4. Pilih **Loading Dock** dan **Jam (Time Slot)** yang masih memiliki sisa kuota (Bukan angka 0).
5. Masukkan **Nomor PO**, **Plat Nomor Truk**, **Nama Sopir**, dan **Jenis Armada** (Maksimal Fuso).
6. Klik **Submit**.
7. Jika kuota tiba-tiba penuh (keduluan supplier lain), sistem akan meminta Anda memilih jam/dock lain.

### Cara Mencetak Tiket QR Code
1. Setelah Booking berhasil, Anda akan dialihkan ke halaman **Detail Booking**.
2. *[Tempatkan Screenshot Tiket QR di sini]*
3. Anda akan melihat gambar **QR Code** berukuran besar.
4. Klik tombol **Download / Cetak Tiket**.
5. Berikan tiket QR ini (bisa dicetak di kertas atau di-screenshot di HP) kepada Sopir Anda sebagai akses masuk Gerbang pabrik besok.

### Cara Reschedule / Cancel (Ubah Jadwal)
1. Buka menu **Jadwal Saya** (My Bookings).
2. Cari booking yang masih berstatus *Booked*.
3. Klik ikon tiga titik (...) dan pilih **Cancel**. (Catatan: Pembatalan hanya bisa dilakukan H-1).
4. Untuk *Reschedule*, Anda harus melakukan pembatalan (Cancel) terlebih dahulu, lalu membuat *Booking Baru* di tanggal yang lain.
