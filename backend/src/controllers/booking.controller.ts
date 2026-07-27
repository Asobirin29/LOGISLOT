import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { BookingStatus } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth';
import { isValidBookingTime, isCancelOrRescheduleAllowed, getEarliestBookableDate } from '../utils/time';
import { v4 as uuidv4 } from 'uuid';
import { broadcastBookingChanged } from '../utils/socket';



/**
 * POST /api/bookings
 * Create a new booking (Supplier only)
 */
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const {
      loading_dock_id,
      time_slot_id,
      tanggal_booking,
      nomor_po,
      plat_nomor_truk,
      nama_sopir,
      jenis_armada
    } = req.body;

    if (!loading_dock_id || !time_slot_id || !tanggal_booking || !nomor_po || !plat_nomor_truk || !nama_sopir || !jenis_armada) {
      return res.status(400).json({ status: 'error', message: 'Semua field wajib diisi' });
    }

    const bookingDate = new Date(tanggal_booking);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ status: 'error', message: 'Format tanggal tidak valid' });
    }

    // Validate booking time (H-1 before 15:00 WIB)
    if (!isValidBookingTime(bookingDate, new Date())) {
      const earliest = getEarliestBookableDate();
      const earliestStr = earliest.toISOString().split('T')[0];
      return res.status(400).json({
        status: 'error',
        message: `Booking harus dilakukan paling lambat H-1 sebelum jam 15:00 WIB. Tanggal booking paling cepat adalah ${earliestStr}.`
      });
    }

    const kode_qr = uuidv4();

    // SERIALIZABLE transaction to prevent race conditions
    const booking = await prisma.$transaction(async (tx) => {
      // Lock the relevant rows with a raw count (Prisma doesn't support SELECT FOR UPDATE natively yet)
      const timeSlot = await tx.time_slots.findUnique({ where: { id: Number(time_slot_id) } });
      if (!timeSlot) throw Object.assign(new Error('Time slot tidak ditemukan'), { code: 'NOT_FOUND' });

      const dock = await tx.loading_docks.findUnique({ where: { id: Number(loading_dock_id) } });
      if (!dock) throw Object.assign(new Error('Loading dock tidak ditemukan'), { code: 'NOT_FOUND' });
      if (dock.status !== 'active') throw Object.assign(new Error('Loading dock sedang tidak aktif'), { code: 'DOCK_INACTIVE' });

      // Count active bookings for this specific dock + slot + date
      const existingCount = await tx.bookings.count({
        where: {
          loading_dock_id: Number(loading_dock_id),
          time_slot_id: Number(time_slot_id),
          tanggal_booking: bookingDate,
          status: { in: [BookingStatus.booked, BookingStatus.arrived, BookingStatus.unloading] }
        }
      });

      if (existingCount >= timeSlot.kuota_maksimal) {
        throw Object.assign(new Error('Slot sudah penuh'), { code: 'SLOT_FULL' });
      }

      return await tx.bookings.create({
        data: {
          user_id: user.id,
          loading_dock_id: Number(loading_dock_id),
          time_slot_id: Number(time_slot_id),
          tanggal_booking: bookingDate,
          nomor_po,
          plat_nomor_truk: plat_nomor_truk.toUpperCase(),
          nama_sopir,
          jenis_armada,
          kode_qr,
          status: BookingStatus.booked
        },
        include: {
          loading_dock: true,
          time_slot: true
        }
      });
    }, { isolationLevel: 'Serializable' });

    broadcastBookingChanged({
      booking_id: booking.id,
      plat_nomor_truk: booking.plat_nomor_truk,
      status_lama: null,
      status_baru: booking.status,
      loading_dock_id: booking.loading_dock_id,
      timestamp: new Date()
    });

    return res.status(201).json({ status: 'success', data: booking });
  } catch (error: any) {
    console.error('[Create Booking Error]', error);
    if (error.code === 'NOT_FOUND' || error.code === 'DOCK_INACTIVE') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    if (error.code === 'SLOT_FULL') {
      return res.status(409).json({ status: 'error', message: 'Slot sudah penuh, silakan pilih jam atau dock lain.' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ status: 'error', message: 'Terjadi konflik booking, silakan coba lagi.' });
    }
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * GET /api/bookings/my
 * Get all bookings belonging to logged-in supplier
 */
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { status, tanggal } = req.query;

    const where: any = { user_id: user.id };

    if (status && typeof status === 'string') {
      where.status = status as BookingStatus;
    }
    if (tanggal && typeof tanggal === 'string') {
      const d = new Date(tanggal);
      if (!isNaN(d.getTime())) where.tanggal_booking = d;
    }

    const bookings = await prisma.bookings.findMany({
      where,
      orderBy: [{ tanggal_booking: 'desc' }, { created_at: 'desc' }],
      include: {
        loading_dock: true,
        time_slot: true
      }
    });

    return res.status(200).json({ status: 'success', data: bookings });
  } catch (error: any) {
    console.error('[Get My Bookings Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * PATCH /api/bookings/:id
 * Reschedule a booking (change time_slot_id/tanggal), min 4 hours before slot start
 */
export const rescheduleBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const id = Number(req.params.id);
    const { time_slot_id, tanggal_booking, loading_dock_id } = req.body;

    const booking = await prisma.bookings.findUnique({
      where: { id },
      include: { time_slot: true }
    });

    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking tidak ditemukan' });
    }

    if (booking.user_id !== user.id) {
      return res.status(403).json({ status: 'error', message: 'Anda tidak berhak mengubah booking ini' });
    }

    if (booking.status !== BookingStatus.booked) {
      return res.status(400).json({ status: 'error', message: 'Hanya booking berstatus "booked" yang bisa di-reschedule' });
    }

    // Check 4-hour rule on CURRENT slot
    if (!isCancelOrRescheduleAllowed(booking.tanggal_booking, booking.time_slot.jam_mulai, new Date())) {
      return res.status(400).json({
        status: 'error',
        message: 'Reschedule tidak bisa dilakukan kurang dari 4 jam sebelum jadwal slot saat ini'
      });
    }

    const newDate = tanggal_booking ? new Date(tanggal_booking) : booking.tanggal_booking;
    const newSlotId = time_slot_id ? Number(time_slot_id) : booking.time_slot_id;
    const newDockId = loading_dock_id ? Number(loading_dock_id) : booking.loading_dock_id;

    // Validate new booking date
    if (!isValidBookingTime(newDate, new Date())) {
      return res.status(400).json({
        status: 'error',
        message: 'Tanggal baru harus memenuhi aturan H-1 sebelum jam 15:00 WIB'
      });
    }

    // Check quota for new slot
    const updated = await prisma.$transaction(async (tx) => {
      const newSlot = await tx.time_slots.findUnique({ where: { id: newSlotId } });
      if (!newSlot) throw Object.assign(new Error('Time slot tidak ditemukan'), { code: 'NOT_FOUND' });

      const count = await tx.bookings.count({
        where: {
          loading_dock_id: newDockId,
          time_slot_id: newSlotId,
          tanggal_booking: newDate,
          status: { in: [BookingStatus.booked, BookingStatus.arrived, BookingStatus.unloading] },
          NOT: { id }
        }
      });

      if (count >= newSlot.kuota_maksimal) {
        throw Object.assign(new Error('Slot sudah penuh'), { code: 'SLOT_FULL' });
      }

      return await tx.bookings.update({
        where: { id },
        data: {
          time_slot_id: newSlotId,
          tanggal_booking: newDate,
          loading_dock_id: newDockId
        },
        include: { loading_dock: true, time_slot: true }
      });
    }, { isolationLevel: 'Serializable' });

    broadcastBookingChanged({
      booking_id: updated.id,
      plat_nomor_truk: updated.plat_nomor_truk,
      status_lama: booking.status, // although it stays 'booked' when rescheduling
      status_baru: updated.status,
      loading_dock_id: updated.loading_dock_id,
      timestamp: new Date()
    });
    return res.status(200).json({ status: 'success', data: updated });
  } catch (error: any) {
    console.error('[Reschedule Booking Error]', error);
    if (error.code === 'NOT_FOUND') return res.status(404).json({ status: 'error', message: error.message });
    if (error.code === 'SLOT_FULL') return res.status(409).json({ status: 'error', message: 'Slot yang dipilih sudah penuh' });
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * DELETE /api/bookings/:id
 * Cancel a booking (soft delete: status → cancelled)
 */
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const id = Number(req.params.id);

    const booking = await prisma.bookings.findUnique({
      where: { id },
      include: { time_slot: true }
    });

    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking tidak ditemukan' });
    }

    if (booking.user_id !== user.id) {
      return res.status(403).json({ status: 'error', message: 'Anda tidak berhak membatalkan booking ini' });
    }

    if (booking.status !== BookingStatus.booked) {
      return res.status(400).json({ status: 'error', message: 'Hanya booking berstatus "booked" yang bisa dibatalkan' });
    }

    if (!isCancelOrRescheduleAllowed(booking.tanggal_booking, booking.time_slot.jam_mulai, new Date())) {
      return res.status(400).json({
        status: 'error',
        message: 'Pembatalan tidak bisa dilakukan kurang dari 4 jam sebelum jadwal slot dimulai'
      });
    }

    const cancelled = await prisma.bookings.update({
      where: { id },
      data: { status: BookingStatus.cancelled },
      include: { loading_dock: true, time_slot: true }
    });

    broadcastBookingChanged({
      booking_id: cancelled.id,
      plat_nomor_truk: cancelled.plat_nomor_truk,
      status_lama: booking.status,
      status_baru: cancelled.status,
      loading_dock_id: cancelled.loading_dock_id,
      timestamp: new Date()
    });
    return res.status(200).json({ status: 'success', message: 'Booking berhasil dibatalkan', data: cancelled });
  } catch (error: any) {
    console.error('[Cancel Booking Error]', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * GET /api/bookings (admin/ic view - all bookings)
 */
export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status, tanggal } = req.query;
    const where: any = {};

    if (status && typeof status === 'string') where.status = status as BookingStatus;
    if (tanggal && typeof tanggal === 'string') {
      const d = new Date(tanggal);
      if (!isNaN(d.getTime())) where.tanggal_booking = d;
    }

    const bookings = await prisma.bookings.findMany({
      where,
      orderBy: [{ tanggal_booking: 'desc' }],
      include: {
        loading_dock: true,
        time_slot: true,
        user: { select: { nama: true, nama_instansi: true, email: true } }
      }
    });

    return res.status(200).json({ status: 'success', data: bookings });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
