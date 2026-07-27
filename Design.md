# Design Guidelines - LOGISLOT

## Palet Warna (Color Palette)
Sistem menggunakan desain premium, dinamis, dan memiliki kontras yang baik.
- **Primary:** Deep Navy Blue `#1B365D` (Warna utama untuk Header, Navbar, Tombol utama)
- **Secondary:** Slate Blue `#2E5B82` (Warna aksen, hover states, elemen pendukung)
- **Background:** Soft Light Grey `#F4F6F9` (Latar belakang utama aplikasi)
- **Text:** Dark Charcoal `#2B2B2B` (Warna teks utama untuk keterbacaan optimal)

## Tipografi
- **Font Family:** `Inter` (utama) atau Arial (fallback), jenis *sans-serif*. Dipilih karena keterbacaan yang sangat baik di berbagai ukuran layar dan kesan modern.

## Aturan UI Khusus per Role
1. **Security (Gate):**
   - Harus ramah pengguna di luar ruangan (outdoor siang hari).
   - Membutuhkan **Mode Kontras Tinggi** (High Contrast Mode).
   - Antarmuka harus *Touch-Friendly* dengan **tombol-tombol berukuran besar** untuk mempermudah operasional menggunakan tablet/smartphone.
2. **Warehouse (Gudang):**
   - Menampilkan denah Loading Dock.
   - Menggunakan tata letak **Card Layout** interaktif untuk masing-masing dock, menunjukkan status dock saat ini (Kosong, Loading, Unloading, Overstay).
   - Harus intuitif untuk menandai mulainya dan selesainya proses bongkar muat.

## Sistem Kode Warna Status
Konsistensi kode warna sangat wajib diimplementasikan di seluruh dashboard:
- 🟢 **Hijau (Normal/Tepat Waktu):** Truk datang sesuai jadwal, proses normal.
- 🟡 **Kuning (Warning):** Mendekati batas SLA, menunggu dock kosong, atau peringatan kedatangan dini/terlambat mendekati batas toleransi.
- 🔴 **Merah (Kritis):** Terlambat >30 menit, Overstay di dock, atau ada isu kritis lainnya.
