import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/auth';
import { broadcastBookingChanged } from '../utils/socket';
import { BookingStatus } from '@prisma/client';



/**
 * GET /api/bookings
 * List all bookings (IC, Admin, Warehouse, Security only)
 * Filters: tanggal, status, loading_dock_id, nomor_po
 */
export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status, tanggal, loading_dock_id, nomor_po } = req.query;
    const where: any = {};

    if (status && typeof status === 'string') {
      where.status = status as BookingStatus;
    }
    if (tanggal && typeof tanggal === 'string') {
      const d = new Date(tanggal);
      if (!isNaN(d.getTime())) where.tanggal_booking = d;
    }
    if (loading_dock_id) {
      where.loading_dock_id = Number(loading_dock_id);
    }
    if (nomor_po && typeof nomor_po === 'string') {
      where.nomor_po = { contains: nomor_po, mode: 'insensitive' };
    }

    const bookings = await prisma.bookings.findMany({
      where,
      orderBy: [
        { priority_level: 'desc' }, // urgent first
        { tanggal_booking: 'asc' },
        { time_slot: { jam_mulai: 'asc' } }
      ],
      include: {
        loading_dock: true,
        time_slot: true,
        user: { select: { id: true, nama: true, nama_instansi: true, email: true } },
        tracking_logs: {
          orderBy: { timestamp_kejadian: 'asc' },
          take: 5
        }
      }
    });

    return res.status(200).json({ status: 'success', data: bookings });
  } catch (error: any) {
    console.error('[Get All Bookings Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * PATCH /api/bookings/:id/priority
 * Set priority_level for a booking (IC and Admin only)
 */
export const updateBookingPriority = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { priority_level } = req.body;

    if (!priority_level || !['normal', 'urgent'].includes(priority_level)) {
      return res.status(400).json({
        status: 'error',
        message: 'priority_level harus berupa "normal" atau "urgent"'
      });
    }

    const booking = await prisma.bookings.findUnique({ where: { id } });
    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking tidak ditemukan' });
    }

    if (booking.status === BookingStatus.completed || booking.status === BookingStatus.cancelled) {
      return res.status(400).json({
        status: 'error',
        message: 'Prioritas tidak bisa diubah untuk booking yang sudah selesai atau dibatalkan'
      });
    }

    const updated = await prisma.bookings.update({
      where: { id },
      data: { priority_level: priority_level as PriorityLevel },
      include: {
        loading_dock: true,
        time_slot: true,
        user: { select: { nama: true, nama_instansi: true } }
      }
    });

    broadcastBookingChanged({
      booking_id: updated.id,
      plat_nomor_truk: updated.plat_nomor_truk,
      status_lama: updated.status, // priority changed, not status
      status_baru: updated.status,
      loading_dock_id: updated.loading_dock_id,
      timestamp: new Date()
    });
    return res.status(200).json({ status: 'success', data: updated });
  } catch (error: any) {
    console.error('[Update Priority Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
