import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/auth';
import { EventType } from '@prisma/client';



const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * GET /api/reports/sla
 * SLA arrival analysis:
 * - Compares scheduled slot start time vs actual arrival time (arrived_at_gate event)
 * - Groups by supplier
 * - Filters by date range
 * Query params: date_from, date_to (YYYY-MM-DD)
 */
export const getSlaReport = async (req: AuthRequest, res: Response) => {
  try {
    const { date_from, date_to } = req.query;

    // Build date range filter
    const dateFilter: any = {};
    if (date_from && typeof date_from === 'string') {
      const df = new Date(date_from);
      if (!isNaN(df.getTime())) dateFilter.gte = df;
    }
    if (date_to && typeof date_to === 'string') {
      const dt = new Date(date_to);
      if (!isNaN(dt.getTime())) {
        dt.setUTCHours(23, 59, 59, 999);
        dateFilter.lte = dt;
      }
    }

    // Get all completed/arrived bookings with their arrival tracking logs
    const bookings = await prisma.bookings.findMany({
      where: {
        status: { in: ['arrived', 'unloading', 'completed'] },
        tanggal_booking: Object.keys(dateFilter).length > 0 ? dateFilter : undefined,
      },
      include: {
        time_slot: true,
        user: { select: { id: true, nama: true, nama_instansi: true } },
        tracking_logs: {
          where: { event_type: EventType.arrived_at_gate },
          orderBy: { timestamp_kejadian: 'asc' },
          take: 1
        }
      }
    });

    // Categorize and aggregate per supplier
    const supplierMap: Record<number, {
      supplier_id: number;
      supplier_nama: string;
      instansi: string;
      tepat_waktu: number;
      terlambat: number;
      lebih_awal: number;
      total: number;
      selisih_menit_total: number; // sum for average
    }> = {};

    const details: Array<{
      booking_id: number;
      nomor_po: string;
      supplier: string;
      instansi: string;
      tanggal: string;
      jadwal_slot: string;
      waktu_tiba: string | null;
      selisih_menit: number | null;
      kategori: 'tepat_waktu' | 'terlambat' | 'lebih_awal' | 'tidak_ada_data';
    }> = [];

    const TOLERANCE_MINUTES = 30; // from Rules.md

    for (const booking of bookings) {
      const supplier = booking.user;
      if (!supplierMap[supplier.id]) {
        supplierMap[supplier.id] = {
          supplier_id: supplier.id,
          supplier_nama: supplier.nama,
          instansi: supplier.nama_instansi || '-',
          tepat_waktu: 0,
          terlambat: 0,
          lebih_awal: 0,
          total: 0,
          selisih_menit_total: 0,
        };
      }

      const row = supplierMap[supplier.id];
      row.total += 1;

      // Build the scheduled datetime by combining tanggal_booking + jam_mulai
      const slotJamMulai = booking.time_slot.jam_mulai;
      const scheduledDt = new Date(booking.tanggal_booking);
      scheduledDt.setUTCHours(slotJamMulai.getUTCHours(), slotJamMulai.getUTCMinutes(), 0, 0);

      const arrivalLog = booking.tracking_logs[0];
      if (!arrivalLog) {
        details.push({
          booking_id: booking.id,
          nomor_po: booking.nomor_po,
          supplier: supplier.nama,
          instansi: supplier.nama_instansi || '-',
          tanggal: booking.tanggal_booking.toISOString().split('T')[0],
          jadwal_slot: scheduledDt.toISOString(),
          waktu_tiba: null,
          selisih_menit: null,
          kategori: 'tidak_ada_data'
        });
        continue;
      }

      const actualArrivalMs = new Date(arrivalLog.timestamp_kejadian).getTime();
      const scheduledMs = scheduledDt.getTime();
      const diffMinutes = Math.round((actualArrivalMs - scheduledMs) / 60000); // + means late

      let kategori: 'tepat_waktu' | 'terlambat' | 'lebih_awal';
      if (diffMinutes > TOLERANCE_MINUTES) {
        kategori = 'terlambat';
        row.terlambat += 1;
      } else if (diffMinutes < -TOLERANCE_MINUTES) {
        kategori = 'lebih_awal';
        row.lebih_awal += 1;
      } else {
        kategori = 'tepat_waktu';
        row.tepat_waktu += 1;
      }

      row.selisih_menit_total += diffMinutes;

      details.push({
        booking_id: booking.id,
        nomor_po: booking.nomor_po,
        supplier: supplier.nama,
        instansi: supplier.nama_instansi || '-',
        tanggal: booking.tanggal_booking.toISOString().split('T')[0],
        jadwal_slot: scheduledDt.toISOString(),
        waktu_tiba: arrivalLog.timestamp_kejadian.toISOString(),
        selisih_menit: diffMinutes,
        kategori
      });
    }

    const summary = Object.values(supplierMap).map(s => ({
      ...s,
      rata_rata_selisih_menit: s.total > 0
        ? Math.round(s.selisih_menit_total / s.total)
        : null,
      pct_tepat_waktu: s.total > 0
        ? Math.round((s.tepat_waktu / s.total) * 100)
        : 0
    })).sort((a, b) => b.pct_tepat_waktu - a.pct_tepat_waktu);

    return res.status(200).json({
      status: 'success',
      data: {
        summary,
        details,
        meta: {
          date_from: date_from || null,
          date_to: date_to || null,
          total_bookings_analyzed: bookings.length,
          tolerance_minutes: TOLERANCE_MINUTES
        }
      }
    });
  } catch (error: any) {
    console.error('[SLA Report Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
