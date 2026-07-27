# Product Requirements Document (PRD) - LOGISLOT

## Latar Belakang & Tujuan
Proses antrian truk manual di lingkungan pabrik/gudang saat ini tidak teratur, menyebabkan waktu tunggu yang lama, bentrokan jadwal bongkar muat, dan kurangnya visibilitas pergerakan material.
LOGISLOT hadir sebagai Platform Manajemen Pemesanan Waktu Truk (Truck Booking Slot Time) & Pelacakan Armada Real-Time.
**Tujuan Bisnis:**
- Mengurangi waktu tunggu truk di gerbang >30%.
- Menghilangkan bentrokan jadwal bongkar muat (double booking).
- Memberikan visibilitas real-time atas material yang sedang dalam perjalanan (in-transit) kepada tim Inventory Control.

## User Persona & Kebutuhan
1. **Supplier/Vendor**
   - *Kebutuhan:* Memesan slot waktu pengiriman dengan mudah, mendapatkan QR Code untuk check-in, dan dapat melakukan reschedule (maks. 4 jam sebelum jadwal).
2. **Inventory Control (IC)**
   - *Kebutuhan:* Memantau jadwal kedatangan secara real-time, memvalidasi material yang datang (in-transit), dan memastikan ketersediaan barang di gudang sesuai jadwal.
3. **Security**
   - *Kebutuhan:* Melakukan check-in/check-out truk dengan cepat di gerbang menggunakan scan QR Code di aplikasi, antarmuka yang mudah digunakan di luar ruangan (kontras tinggi, tombol besar).
4. **Warehouse (Gudang)**
   - *Kebutuhan:* Mengelola alokasi Loading Dock, memantau proses bongkar muat (loading/unloading), melihat denah Loading Dock, dan menandai status penyelesaian bongkar muat.
5. **System Admin**
   - *Kebutuhan:* Mengelola master data (user, instansi, loading dock, time slot), role pengguna, dan memantau performa sistem secara keseluruhan.

## Acceptance Criteria & SLA (Service Level Agreement)
- **Kapasitas Booking:** Sistem harus sanggup menangani minimal 200 booking slot per hari.
- **Kecepatan Scan:** Proses scan QR Code di gerbang harus selesai kurang dari 3 detik.
- **Update Real-time:** Update data di dashboard real-time harus memiliki latency di bawah 1 detik.
- **Performa Umum:** Latency umum sistem di bawah 200ms saat diakses ratusan user bersamaan.

## Daftar Fitur Utama per Modul
1. **Modul Booking (Supplier):** Pemilihan Loading Dock dan Time Slot, Generate QR Code, Daftar Riwayat Booking, Pembatalan/Reschedule.
2. **Modul Validasi IC (Inventory Control):** Dashboard visibilitas in-transit, validasi jadwal dan dokumen PO, notifikasi keterlambatan.
3. **Modul Gate Check-in/out (Security):** Scanner QR Code, pencatatan waktu tiba (ATA) dan waktu keluar, peringatan jika early/late arrival melewati batas toleransi.
4. **Modul Dock Assignment (Warehouse):** Tampilan denah Dock (Card Layout), update status bongkar muat (Mulai/Selesai), alert overstay di dock.
5. **Modul Dashboard Real-time:** Live update status pergerakan semua armada (booked, in-transit, arrived, unloading, completed), filter berdasarkan status dan dock.
6. **Modul Admin Panel:** Manajemen User, Role, Loading Docks, Time Slots, Konfigurasi Sistem.
