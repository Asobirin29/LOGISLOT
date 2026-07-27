import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/auth';
import { broadcastBookingChanged } from '../utils/socket';
import { BookingStatus, EventType } from '@prisma/client';



const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const TOLERANCE_MINUTES = 30;

/**
 * Compute scheduled slot datetime from tanggal_booking + time_slot jam_mulai (both UTC)
 */
function buildSlotDateTime(tanggalBooking: Date, jamMulai: Date): Date {
  const dt = new Date(tanggalBooking);
  dt.setUTCHours(jamMulai.getUTCHours(), jamMulai.getUTCMinutes(), 0, 0);
  return dt;
}

/**
 * POST /api/gate/scan
 * Main QR-scan endpoint — handles both CHECK-IN and CHECK-OUT
 */
export const scanQR = async (req: AuthRequest, res: Response) => {
  const start = Date.now();
  try {
    const { kode_qr } = req.body;
    const securityUserId = req.user!.id;

    if (!kode_qr || typeof kode_qr !== 'string') {
      return res.status(400).json({ status: 'error', message: 'kode_qr wajib diisi' });
    }

    // Eager-load all relations we'll need — single query for speed
    const booking = await prisma.bookings.findUnique({
      where: { kode_qr: kode_qr.trim() },
      include: {
        time_slot: true,
        loading_dock: true,
        user: { select: { id: true, nama: true, nama_instansi: true } },
        tracking_logs: {
          orderBy: { timestamp_kejadian: 'asc' }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'QR Code tidak valid atau booking tidak ditemukan' });
    }

    const now = new Date();
    const scheduledDt = buildSlotDateTime(booking.tanggal_booking, booking.time_slot.jam_mulai);
    const diffMinutes = Math.round((now.getTime() - scheduledDt.getTime()) / 60000); // + = late

    // --------- CHECK-IN path ---------
    if (booking.status === BookingStatus.booked) {
      const out_of_tolerance = Math.abs(diffMinutes) > TOLERANCE_MINUTES;
      const early = diffMinutes < -TOLERANCE_MINUTES;
      const late = diffMinutes > TOLERANCE_MINUTES;

      // Do update + log in one transaction
      const [updatedBooking, log] = await prisma.$transaction([
        prisma.bookings.update({
          where: { id: booking.id },
          data: { status: BookingStatus.arrived }
        }),
        prisma.tracking_logs.create({
          data: {
            booking_id: booking.id,
            event_type: EventType.arrived_at_gate,
            timestamp_kejadian: now,
            reported_by_user_id: securityUserId,
            catatan: out_of_tolerance
              ? (early ? `Early arrival: ${Math.abs(diffMinutes)} mnt lebih awal` : `Late arrival: ${diffMinutes} mnt terlambat`)
              : 'Kedatangan dalam toleransi waktu'
          }
        })
      ]);

      const elapsed = Date.now() - start;
      console.log(`[Gate Scan] CHECK-IN booking #${booking.id} in ${elapsed}ms`);

      broadcastBookingChanged({
        booking_id: updatedBooking.id,
        plat_nomor_truk: updatedBooking.plat_nomor_truk,
        status_lama: booking.status,
        status_baru: updatedBooking.status,
        loading_dock_id: updatedBooking.loading_dock_id,
        timestamp: new Date()
      });

      return res.status(200).json({
        status: 'success',
        event: 'CHECK_IN',
        out_of_tolerance,
        early,
        late,
        selisih_menit: diffMinutes,
        data: {
          booking_id: booking.id,
          kode_qr: booking.kode_qr,
          status: updatedBooking.status,
          nomor_po: booking.nomor_po,
          plat_nomor_truk: booking.plat_nomor_truk,
          nama_sopir: booking.nama_sopir,
          jenis_armada: booking.jenis_armada,
          supplier: booking.user.nama,
          instansi: booking.user.nama_instansi,
          loading_dock: booking.loading_dock.nama_dock,
          jadwal_slot: scheduledDt.toISOString(),
          waktu_aktual: now.toISOString(),
          timestamp_log: log.timestamp_kejadian.toISOString()
        }
      });
    }

    // --------- CHECK-OUT path ---------
    if (booking.status === BookingStatus.completed) {
      // Find ATA log
      const ataLog = booking.tracking_logs.find(l => l.event_type === EventType.arrived_at_gate);
      const checkoutTime = now;
      const turnaroundMs = ataLog
        ? checkoutTime.getTime() - new Date(ataLog.timestamp_kejadian).getTime()
        : null;
      const turnaroundMinutes = turnaroundMs !== null ? Math.round(turnaroundMs / 60000) : null;

      await prisma.tracking_logs.create({
        data: {
          booking_id: booking.id,
          event_type: EventType.checked_out,
          timestamp_kejadian: checkoutTime,
          reported_by_user_id: securityUserId,
          catatan: turnaroundMinutes !== null ? `Total turnaround: ${turnaroundMinutes} menit` : undefined
        }
      });

      const elapsed = Date.now() - start;
      console.log(`[Gate Scan] CHECK-OUT booking #${booking.id} in ${elapsed}ms`);

      broadcastBookingChanged({
        booking_id: booking.id,
        plat_nomor_truk: booking.plat_nomor_truk,
        status_lama: booking.status,
        status_baru: BookingStatus.completed,
        loading_dock_id: booking.loading_dock_id,
        timestamp: new Date()
      });

      return res.status(200).json({
        status: 'success',
        event: 'CHECK_OUT',
        data: {
          booking_id: booking.id,
          plat_nomor_truk: booking.plat_nomor_truk,
          supplier: booking.user.nama,
          waktu_checkout: checkoutTime.toISOString(),
          waktu_tiba: ataLog?.timestamp_kejadian.toISOString() || null,
          turnaround_menit: turnaroundMinutes
        }
      });
    }

    // --------- INTERMEDIATE STATUS (arrived / unloading) — blocking check-out ---------
    if (booking.status === BookingStatus.arrived || booking.status === BookingStatus.unloading) {
      const statusLabel = booking.status === BookingStatus.arrived ? 'baru tiba' : 'sedang bongkar muat';
      return res.status(409).json({
        status: 'error',
        message: `Truk belum selesai bongkar muat di gudang. Status saat ini: ${statusLabel}.`,
        current_status: booking.status,
        booking_id: booking.id
      });
    }

    // --------- CANCELLED ---------
    if (booking.status === BookingStatus.cancelled) {
      return res.status(400).json({
        status: 'error',
        message: 'Booking ini telah dibatalkan dan tidak bisa diproses.',
        current_status: booking.status
      });
    }

    return res.status(400).json({
      status: 'error',
      message: `Status booking tidak bisa diproses: ${booking.status}`
    });

  } catch (error: any) {
    console.error('[Gate Scan Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * POST /api/gate/manual-checkin
 * Fallback: check-in by plate number if QR can't be scanned
 */
export const manualCheckin = async (req: AuthRequest, res: Response) => {
  try {
    const { plat_nomor_truk, tanggal } = req.body;
    const securityUserId = req.user!.id;

    if (!plat_nomor_truk) {
      return res.status(400).json({ status: 'error', message: 'plat_nomor_truk wajib diisi' });
    }

    const searchDate = tanggal ? new Date(tanggal) : new Date();
    searchDate.setUTCHours(0, 0, 0, 0);

    // Find matching booking for today with 'booked' status
    const booking = await prisma.bookings.findFirst({
      where: {
        plat_nomor_truk: { equals: plat_nomor_truk.toUpperCase().trim(), mode: 'insensitive' },
        tanggal_booking: searchDate,
        status: BookingStatus.booked
      },
      include: {
        time_slot: true,
        loading_dock: true,
        user: { select: { id: true, nama: true, nama_instansi: true } }
      },
      orderBy: { time_slot: { jam_mulai: 'asc' } }
    });

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: `Tidak ditemukan booking aktif untuk plat ${plat_nomor_truk.toUpperCase()} pada tanggal ${searchDate.toISOString().split('T')[0]}`
      });
    }

    // Reuse scan QR logic — inject kode_qr and call internally
    req.body = { kode_qr: booking.kode_qr };
    return scanQR(req, res);
  } catch (error: any) {
    console.error('[Manual Checkin Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * GET /api/gate/queue
 * Today's queue: all 'booked' bookings sorted by slot time
 */
export const getTodayQueue = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const bookings = await prisma.bookings.findMany({
      where: {
        tanggal_booking: today,
        status: { in: [BookingStatus.booked, BookingStatus.arrived, BookingStatus.unloading] }
      },
      orderBy: { time_slot: { jam_mulai: 'asc' } },
      include: {
        time_slot: true,
        loading_dock: true,
        user: { select: { nama: true, nama_instansi: true } }
      }
    });

    return res.status(200).json({
      status: 'success',
      data: bookings,
      meta: {
        date: today.toISOString().split('T')[0],
        total: bookings.length
      }
    });
  } catch (error: any) {
    console.error('[Get Queue Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
