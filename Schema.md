# Skema Database (PostgreSQL) - LOGISLOT

Berikut rancangan struktur tabel utama di dalam database PostgreSQL:

## 1. Tabel `users`
| Kolom | Tipe Data | Constraint |
|---|---|---|
| `id` | UUID/SERIAL | PRIMARY KEY |
| `nama` | VARCHAR(255) | NOT NULL |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL |
| `password_hash` | VARCHAR(255) | NOT NULL |
| `nama_instansi` | VARCHAR(255) | NOT NULL |
| `role` | VARCHAR(50) | ENUM('supplier', 'ic', 'security', 'warehouse', 'admin'), NOT NULL |
| `is_active` | BOOLEAN | DEFAULT TRUE |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

## 2. Tabel `loading_docks`
| Kolom | Tipe Data | Constraint |
|---|---|---|
| `id` | UUID/SERIAL | PRIMARY KEY |
| `nama_dock` | VARCHAR(100) | NOT NULL |
| `deskripsi` | TEXT | Kategori material |
| `kapasitas_maksimal` | INT | NOT NULL, DEFAULT 1 |
| `status` | VARCHAR(50) | ENUM('active', 'maintenance'), DEFAULT 'active' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

## 3. Tabel `time_slots`
| Kolom | Tipe Data | Constraint |
|---|---|---|
| `id` | UUID/SERIAL | PRIMARY KEY |
| `jam_mulai` | TIME | NOT NULL |
| `jam_selesai` | TIME | NOT NULL |
| `kuota_maksimal` | INT | NOT NULL, DEFAULT 1 |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

## 4. Tabel `bookings`
| Kolom | Tipe Data | Constraint |
|---|---|---|
| `id` | UUID/SERIAL | PRIMARY KEY |
| `user_id` | UUID/INT | FOREIGN KEY (users.id), NOT NULL |
| `loading_dock_id` | UUID/INT | FOREIGN KEY (loading_docks.id), NOT NULL |
| `time_slot_id` | UUID/INT | FOREIGN KEY (time_slots.id), NOT NULL |
| `tanggal_booking` | DATE | NOT NULL |
| `nomor_po` | VARCHAR(100) | NOT NULL |
| `plat_nomor_truk`| VARCHAR(20) | NOT NULL |
| `nama_sopir` | VARCHAR(100) | NOT NULL |
| `jenis_armada` | VARCHAR(50) | NOT NULL |
| `kode_qr` | UUID | UNIQUE, DEFAULT gen_random_uuid() |
| `status` | VARCHAR(50) | ENUM('booked', 'arrived', 'unloading', 'completed', 'cancelled'), DEFAULT 'booked' |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
*(Wajib: Unique constraint `UNIQUE(loading_dock_id, tanggal_booking, time_slot_id)` WHERE status NOT IN ('cancelled') untuk mencegah double booking).*

## 5. Tabel `tracking_logs`
| Kolom | Tipe Data | Constraint |
|---|---|---|
| `id` | UUID/SERIAL | PRIMARY KEY |
| `booking_id` | UUID/INT | FOREIGN KEY (bookings.id), NOT NULL |
| `event_type` | VARCHAR(50) | ENUM('ATA', 'start_unloading', 'finish_unloading', 'checked_out'), NOT NULL |
| `timestamp_kejadian`| TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| `reported_by_user_id`| UUID/INT | FOREIGN KEY (users.id), NOT NULL |
| `catatan` | TEXT | Opsional |
