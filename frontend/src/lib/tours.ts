import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

export const tourStepsByPath: Record<string, DriveStep[]> = {
  // ==========================================
  // --- SUPPLIER TOURS ---
  // ==========================================
  '/supplier': [
    {
      element: '[data-tour="sidebar-menu"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#1B365D; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Navigasi</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Menu Utama Supplier</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Gunakan menu navigasi sidebar ini untuk mengakses seluruh fitur portal Supplier LogisSlot secara cepat.</p>
            <div style="background:#f1f5f9; padding:8px 10px; border-radius:8px; margin-top:8px; border-left:3px solid #1B365D;">
              <strong>📌 Fitur Tersedia:</strong>
              <ul style="margin-top:4px; padding-left:14px; margin-bottom:0;">
                <li><strong>Home:</strong> Kalender & ketersediaan slot</li>
                <li><strong>Create Booking:</strong> Buat reservasi baru</li>
                <li><strong>My Bookings:</strong> Kelola tiket & QR Code</li>
                <li><strong>History:</strong> Tinjau riwayat bongkar muat</li>
              </ul>
            </div>
          </div>
        `,
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '[data-tour="supplier-calendar-overview"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#0284C7; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Visual Kalender</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Kalender Ketersediaan Slot</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Kalender ini menampilkan gambaran ketersediaan kapasitas <em>loading dock</em> untuk setiap hari kerja dalam sebulan.</p>
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:8px 10px; border-radius:8px; margin-top:8px;">
              <strong>🟢 Indikator Status Kuota:</strong>
              <ul style="margin-top:4px; padding-left:14px; margin-bottom:0; color:#166534;">
                <li><span style="color:#10B981;">●</span> <strong>Hijau:</strong> Slot waktu masih melimpah</li>
                <li><span style="color:#F59E0B;">●</span> <strong>Kuning:</strong> Kuota slot terbatas</li>
                <li><span style="color:#EF4444;">●</span> <strong>Merah:</strong> Kuota slot sudah penuh</li>
              </ul>
            </div>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="supplier-calendar-month"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#4F46E5; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Navigasi Bulan</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Navigasi Bulan & Jadwal</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Klik tombol panah di sudut kanan atas kalender untuk berpindah bulan dan merencanakan pengiriman jangka panjang.</p>
            <div style="background:#fffbeb; border:1px solid #fef3c7; padding:8px; border-radius:8px; margin-top:6px; color:#92400e;">
              💡 <strong>Tips:</strong> Booking jauh-jauh hari memastikan Anda mendapatkan jam kedatangan paling ideal.
            </div>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="supplier-slot-list"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#059669; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Pilihan Jam</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Daftar Time Slot Spesifik</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Kolom ini menampilkan rincian jam operasional <em>dock</em> pada tanggal yang sedang dipilih.</p>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:8px 10px; border-radius:8px; margin-top:8px;">
              <strong>📌 Aksi Cepat:</strong>
              <p style="margin-top:2px; margin-bottom:0;">Arahkan kursor (*hover*) pada jam yang diminati lalu klik tombol <strong>"Pilih"</strong> untuk langsung melakukan reservasi.</p>
            </div>
          </div>
        `,
        side: 'left'
      }
    },
    {
      element: '[data-tour="header-tour-btn"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#1B365D; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Panduan</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Tombol Panduan Interaktif</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Anda dapat mengulang tur interaktif ini kapan saja dengan mengklik tombol <strong>"Panduan Halaman"</strong> di bagian header teratas ini.</p>
          </div>
        `,
        side: 'bottom',
        align: 'end'
      }
    }
  ],

  '/supplier/booking': [
    {
      element: '[data-tour="booking-date-picker"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#2563EB; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Langkah 1</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Tanggal Kedatangan Armada</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Langkah pertama dalam membuat booking adalah menentukan tanggal pasti kapan truk/armada Anda akan tiba di lokasi gudang LogisSlot.</p>
            <div style="background:#eff6ff; border:1px solid #dbeafe; padding:8px 10px; border-radius:8px; margin-top:6px; color:#1e40af;">
              ℹ️ Sistem secara otomatis akan memperbarui daftar slot yang tersedia saat tanggal diubah.
            </div>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="slot-selection"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#2563EB; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Langkah 2</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Alokasi Dock & Jam Slot</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Pilih kategori <em>Loading Dock</em> yang sesuai dengan jenis material barang yang dikirim (misal: Raw Material, Packaging, atau Chemical), kemudian pilih jam yang kuotanya masih mencukupi.</p>
          </div>
        `,
        side: 'top'
      }
    },
    {
      element: '[data-tour="booking-form-fields"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#2563EB; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Langkah 3</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Form Data Pengiriman & Armada</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Isi rincian pengiriman secara valid untuk mempermudah verifikasi Security di pintu gerbang:</p>
            <ul style="margin-top:6px; padding-left:14px; margin-bottom:0; font-size:12px;">
              <li><strong>Nomor Purchase Order (PO):</strong> Sebagai bukti dokumen resmi transaksi</li>
              <li><strong>Nomor Plat Truk:</strong> Identifikasi armada fisik di gerbang</li>
              <li><strong>Nama & Telepon Sopir:</strong> Untuk verifikasi ID & panggilan suara</li>
              <li><strong>Jenis Armada:</strong> Wingbox, CDD, Fuso, Container, dll.</li>
            </ul>
          </div>
        `,
        side: 'top'
      }
    },
    {
      element: '[data-tour="submit-booking-btn"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#16A34A; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Finalisasi</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Konfirmasi & Generasi QR</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Klik <strong>"Kirim Booking"</strong> untuk memfinalisasi reservasi Anda. Sistem akan mengunci kuota dan membuatkan <strong>Tiket QR Digital</strong> secara otomatis.</p>
          </div>
        `,
        side: 'top'
      }
    }
  ],

  '/supplier/bookings': [
    {
      element: '[data-tour="bookings-filter"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#0284C7; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Filter & Cari</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Pencarian & Penyaringan Tiket</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Temukan tiket booking tertentu dengan memfilter status (<em>Booked, Arrived, Completed, Cancelled</em>) atau mengetikkan Nomor PO / Plat Nomor Truk di kolom pencarian.</p>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="bookings-table"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#4F46E5; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Daftar Tiket</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Daftar Booking Aktif</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Tabel ini menampilkan tiket pengiriman Anda lengkap dengan status <em>tracking</em> real-time dari pintu gerbang hingga penyelelesaian di gudang.</p>
          </div>
        `,
        side: 'top'
      }
    },
    {
      element: '[data-tour="ticket-qr-btn"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#16A34A; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">QR Code</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Tampilkan & Cetak Tiket QR</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Klik tombol bermotif QR ini untuk menampilkan <strong>Tiket Masuk Digital</strong>. Berikan QR code ini kepada sopir armada Anda untuk di-scan oleh Petugas Security di pintu masuk gerbang.</p>
          </div>
        `,
        side: 'left'
      }
    }
  ],

  '/supplier/history': [
    {
      element: '[data-tour="history-header"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#475569; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Arsip</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Riwayat Transaksi Pengiriman</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Halaman ini mengarsipkan seluruh pengiriman yang telah selesai dikerjakan atau dibatalkan beserta rekam jejak ketepatan waktunya.</p>
          </div>
        `,
        side: 'bottom'
      }
    }
  ],

  // ==========================================
  // --- ADMIN TOURS ---
  // ==========================================
  '/admin': [
    {
      element: '[data-tour="admin-stat-overview"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#1B365D; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Administrator</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Portal Pusat Administrator LogisSlot</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Selamat datang di konsol kontrol utama administrator LogisSlot. Dari halaman ini Anda mengendalikan seluruh parameter operasional platform.</p>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="admin-quick-nav"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#0284C7; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Manajemen Hub</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Modul Pengaturan Utama</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Akses cepat ke 4 pilar kontrol sistem LogisSlot:</p>
            <ul style="margin-top:6px; padding-left:14px; margin-bottom:0; font-size:12px;">
              <li><strong>Time Slot & Kuota:</strong> Atur interval jam operasional & kuota truk</li>
              <li><strong>Loading Dock Master:</strong> Konfigurasi bay & jenis kargo</li>
              <li><strong>User Management:</strong> Akun & Hak Akses pengguna</li>
              <li><strong>Audit Log:</strong> Rekam jejak seluruh aktivitas user</li>
            </ul>
          </div>
        `,
        side: 'top'
      }
    },
    {
      element: '[data-tour="admin-status-grid"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#16A34A; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Health Check</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Status Operasional Infrastruktur</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Pantau kesehatan koneksi database, gateway WebSocket real-time, dan modul autentikasi JWT secara live.</p>
          </div>
        `,
        side: 'top'
      }
    }
  ],

  '/admin/slots': [
    {
      element: '[data-tour="slots-header"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#2563EB; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Konfigurasi</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Manajemen Time Slot & Kuota</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Halaman ini digunakan untuk membatasi kuota maksimal truk per jam guna mencegah penumpukan antrean di area pergudangan.</p>
          </div>
        `,
        side: 'bottom'
      }
    }
  ],

  '/admin/docks': [
    {
      element: '[data-tour="docks-header"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#D97706; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Master Data</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Master Loading Dock Bay</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Atur nama bay dock, kategori kargo yang didukung, serta toggle status maintenance jika dock sedang diperbaiki.</p>
          </div>
        `,
        side: 'bottom'
      }
    }
  ],

  '/admin/users': [
    {
      element: '[data-tour="users-header"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#059669; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Keamanan</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Manajemen User & Role Access</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Kelola akun pengguna untuk seluruh 5 peran sistem (Supplier, Security, Operator Gudang, Logistics Control / IC, dan Admin).</p>
          </div>
        `,
        side: 'bottom'
      }
    }
  ],

  '/admin/audit': [
    {
      element: '[data-tour="audit-header"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#7C3AED; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Keamanan Audit</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Audit Log & Activity Stream</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Catatan audit ini merekam setiap perubahan data sensitif, waktu pemanggilan truk, hingga perubahan status secara persis dan transparan.</p>
          </div>
        `,
        side: 'bottom'
      }
    }
  ],

  // ==========================================
  // --- SECURITY TOURS ---
  // ==========================================
  '/security': [
    {
      element: '[data-tour="security-scanner"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#1B365D; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Pintu Gerbang</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Scanner Kamera QR Gate Check-In</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Klik tombol utama berwarna biru ini untuk mengaktifkan scanner QR Kamera saat truk tiba di pintu gerbang luar.</p>
            <div style="background:#eff6ff; border:1px solid #dbeafe; padding:8px 10px; border-radius:8px; margin-top:6px; color:#1e40af;">
              ⚡ <strong>Kecepatan Verifikasi:</strong> Scanning QR membutuhkan waktu kurang dari 2 detik untuk mencatat waktu kedatangan aktual (ATA).
            </div>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="security-manual-btn"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#475569; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Fallback</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Input Manual Plat Nomor</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Jika HP sopir mati atau QR tidak dapat terbaca, gunakan tombol ini untuk mencari tiket berdasarkan Plat Nomor Truk secara manual.</p>
          </div>
        `,
        side: 'top'
      }
    },
    {
      element: '[data-tour="security-queue-bar"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#0284C7; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Monitoring</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Status Antrean Gerbang Harian</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Bar ini memperlihatkan total armada yang dijadwalkan tiba hari ini. Klik "Lihat Daftar" untuk meninjau detail urutan antrean.</p>
          </div>
        `,
        side: 'top'
      }
    }
  ],

  '/security/queue': [
    {
      element: '[data-tour="security-queue-header"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#1B365D; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Antrean Gerbang</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Daftar Antrean Armada Harian</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Tinjau daftar truk yang sudah tiba di kantong parkir luar gerbang dan siap dipanggil masuk ke area gudang.</p>
          </div>
        `,
        side: 'bottom'
      }
    }
  ],

  // ==========================================
  // --- WAREHOUSE TOURS ---
  // ==========================================
  '/warehouse': [
    {
      element: '[data-tour="wh-stat-summary"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#1B365D; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Operasional Gudang</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Dashboard Pengawasan Loading Dock</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Dashboard ini dirancang khusus untuk Operator Gudang guna mengendalikan durasi proses bongkar muat barang agar sesuai SLA target.</p>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="wh-dock-monitor"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#0284C7; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Monitor Dock</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Grid Status Real-Time Dock Bay</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Setiap kartu mewakili 1 bay dock fisik. Anda dapat melakukan panggillan armada (*Call Truck*), memulai timer bongkar, atau menandai selesai.</p>
          </div>
        `,
        side: 'top'
      }
    }
  ],

  '/warehouse/map': [
    {
      element: '[data-tour="wh-map-header"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#059669; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Visual Layout</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Denah Interaktif Area Yard & Dock</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Visualisasi spasial denah lokasi fisik pergudangan untuk memantau posisi truk secara langsung.</p>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="wh-map-grid"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#D97706; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Warna Status</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Legenda Status Warna Bay</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Warna pada denah mengindikasikan status operasional saat ini:</p>
            <ul style="margin-top:4px; padding-left:14px; margin-bottom:0;">
              <li>🟢 <strong>Hijau:</strong> Bay Kosong & Siap Digunakan</li>
              <li>🟡 <strong>Kuning:</strong> Proses Bongkar Sedang Berlangsung</li>
              <li>🔴 <strong>Merah:</strong> Terisi / Melebihi Batas Waktu SLA</li>
              <li>⚪ <strong>Abu-abu:</strong> Dock Sedang Diperbaiki / Off</li>
            </ul>
          </div>
        `,
        side: 'top'
      }
    }
  ],

  '/warehouse/verify': [
    {
      element: '[data-tour="wh-verify-header"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#7C3AED; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Inspeksi</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Form Inspeksi & Verifikasi Barang</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Pemeriksaan kondisi kargo fisik sebelum barang dimasukkan ke dalam rak penyimpanan (*putaway*).</p>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="wh-verify-form"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#2563EB; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Checklist</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Formulir Checklist Fisik PO</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Pastikan jumlah kargo sesuai dokumen PO dan tandai jika ditemukan kemasan rusak atau barang kurang.</p>
          </div>
        `,
        side: 'top'
      }
    }
  ],

  // ==========================================
  // --- INVENTORY CONTROL (IC) TOURS ---
  // ==========================================
  '/ic': [
    {
      element: '[data-tour="ic-monitoring-header"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#1B365D; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Control Tower</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Menara Pengawas Kedatangan Material</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Tim Logistics Control / IC memantau pergerakan rantai pasok material yang berdampak langsung pada lini produksi pabrik.</p>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="ic-priority-toggle"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#EF4444; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Prioritas Urgent</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Eskalasi Prioritas Slot Kargo</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Ubah status prioritas truk menjadi <strong>Urgent</strong> jika bahan baku di dalamnya sangat dibutuhkan oleh lini pabrik agar didahulukan oleh tim gudang.</p>
          </div>
        `,
        side: 'bottom'
      }
    }
  ],

  '/ic/reports': [
    {
      element: '[data-tour="ic-report-header"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#0284C7; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Analisis SLA</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Laporan Performa Ketepatan Waktu Vendor</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Evaluasi skor performa SLA supplier berdasarkan rasio kedatangan tepat waktu (On-Time Arrival Rate).</p>
          </div>
        `,
        side: 'bottom'
      }
    }
  ],

  // ==========================================
  // --- COMMON TOURS ---
  // ==========================================
  '/settings': [
    {
      element: '[data-tour="sidebar-help-settings"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#475569; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Pengaturan</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Pengaturan Akun & Profil</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Perbarui informasi akun, ganti password, atau atur preferensi notifikasi pengiriman.</p>
          </div>
        `,
        side: 'right'
      }
    }
  ],

  '/support': [
    {
      element: '[data-tour="support-faq"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#0284C7; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Pusat Bantuan</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Pertanyaan Populer (FAQ)</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Temukan solusi cepat untuk kendala seputar reservasi slot, proses scan tiket, atau perubahan jadwal armada.</p>
          </div>
        `,
        side: 'bottom'
      }
    },
    {
      element: '[data-tour="support-ticket-btn"]',
      popover: {
        title: `
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="background:#16A34A; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Helpdesk</span>
            <span style="font-weight:700; color:#0b1c30; font-size:14px;">Tiket Bantuan IT</span>
          </div>
        `,
        description: `
          <div style="font-size:12.5px; line-height:1.5; color:#334155;">
            <p>Jika Anda menemui kendala teknis sistem, buat tiket bantuan untuk ditangani oleh tim Helpdesk LogisSlot.</p>
          </div>
        `,
        side: 'top'
      }
    }
  ]
};

export const startTourForPath = (pathname: string) => {
  // Find exact matching steps or fallback to base path matching
  let steps = tourStepsByPath[pathname];
  
  if (!steps) {
    // Fallback matching
    const matchingKey = Object.keys(tourStepsByPath).find(key => pathname.startsWith(key) && key !== '/');
    if (matchingKey) {
      steps = tourStepsByPath[matchingKey];
    }
  }

  if (!steps || steps.length === 0) {
    // Default tour if path has no specific steps
    steps = [
      {
        element: '[data-tour="sidebar-menu"]',
        popover: {
          title: `
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
              <span style="background:#1B365D; color:#ffffff; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; text-transform:uppercase;">Panduan</span>
              <span style="font-weight:700; color:#0b1c30; font-size:14px;">Navigasi Dashboard LogisSlot</span>
            </div>
          `,
          description: `
            <div style="font-size:12.5px; line-height:1.5; color:#334155;">
              <p>Pilih menu sidebar untuk berpindah ke fitur-fitur operasional yang tersedia sesuai dengan hak akses Anda.</p>
            </div>
          `,
          side: 'right'
        }
      }
    ];
  }

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    doneBtnText: 'Selesai Panduan ✓',
    nextBtnText: 'Lanjut ›',
    prevBtnText: '‹ Kembali',
    progressText: 'Langkah {{step}} dari {{total}}',
    steps: steps
  });

  driverObj.drive();
};
