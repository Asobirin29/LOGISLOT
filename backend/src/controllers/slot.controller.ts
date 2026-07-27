import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/auth';



/**
 * GET /api/slots/available?tanggal=YYYY-MM-DD
 * Returns time_slots with remaining quota per loading_dock for a given date
 */
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { tanggal } = req.query;

    if (!tanggal || typeof tanggal !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Parameter tanggal (YYYY-MM-DD) wajib diisi' });
    }

    const bookingDate = new Date(tanggal);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ status: 'error', message: 'Format tanggal tidak valid, gunakan YYYY-MM-DD' });
    }

    // Get all active loading docks
    const docks = await prisma.loading_docks.findMany({
      where: { status: 'active' },
      orderBy: { id: 'asc' }
    });

    // Get all time slots
    const timeSlots = await prisma.time_slots.findMany({
      orderBy: { jam_mulai: 'asc' }
    });

    // Count active bookings per (dock, slot, date) in one query
    const activeBookings = await prisma.bookings.groupBy({
      by: ['loading_dock_id', 'time_slot_id'],
      where: {
        tanggal_booking: bookingDate,
        status: { in: ['booked', 'arrived', 'unloading'] }
      },
      _count: { id: true }
    });

    // Build a lookup map for quick access
    const bookingMap: Record<string, number> = {};
    for (const row of activeBookings) {
      const key = `${row.loading_dock_id}:${row.time_slot_id}`;
      bookingMap[key] = row._count.id;
    }

    // Build response matrix
    const result = docks.map(dock => ({
      dock,
      slots: timeSlots.map(slot => {
        const key = `${dock.id}:${slot.id}`;
        const booked = bookingMap[key] || 0;
        const sisa = slot.kuota_maksimal - booked;
        return {
          slot,
          kuota_maksimal: slot.kuota_maksimal,
          booked,
          sisa_kuota: sisa,
          tersedia: sisa > 0
        };
      })
    }));

    return res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    console.error('[Get Available Slots Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
