# Aturan Bisnis & Standar - LOGISLOT

## Aturan Bisnis Aplikasi
1. **Batas Waktu Pemesanan:** Booking slot maksimal dilakukan pada **H-1 sebelum jam 15:00 WIB**.
2. **Batas Waktu Pembatalan:** Pembatalan atau reschedule oleh supplier (vendor) maksimal **4 jam sebelum** jadwal slot dimulai.
3. **Toleransi Kedatangan Truk (Gate Check-in):**
   - **Early Arrival:** Truk boleh check-in paling cepat **30 menit sebelum** slot dimulai.
   - **Late Arrival:** Truk boleh check-in paling lambat **30 menit setelah** slot dimulai.
   - Kedatangan di luar jendela waktu tersebut (-30 menit s.d. +30 menit) akan memicu munculnya warning di sistem Security.
4. **Proteksi Race Condition:** Setiap transaksi booking slot *wajib* dibungkus dengan Database Transaction menggunakan Isolation Level **Serializable** atau minimal **Repeatable Read**. Hal ini kritis untuk mencegah bentrokan (double-booking) ketika banyak supplier mencoba mengambil slot dan dock yang sama di saat yang nyaris bersamaan.

## Standar Penulisan & Pengembangan Kode
1. **Linter & Formatter:** Wajib menggunakan **ESLint** dipadukan dengan **Prettier** untuk seluruh basis kode JS/TS.
2. **Unit Testing:** Wajib menulis Unit Test untuk setiap fungsi kalkulasi bisnis dan logika kritis (misal: validasi SLA, transaksi booking). Target Code Coverage adalah **minimal 80%**.
3. **Commit Messages:** Penggunaan Git wajib menggunakan konvensi **Conventional Commits**.
   - Contoh: `feat(booking): add QR generation endpoint`
   - Contoh: `fix(gate): resolve timezone issue on checkin time`
   - Contoh: `docs(schema): update booking table structure`
