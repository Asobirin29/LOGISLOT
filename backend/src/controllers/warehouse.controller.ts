import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/auth';
import { broadcastBookingChanged, broadcastDockChanged } from '../utils/socket';
import { BookingStatus, EventType, LoadingDockStatus } from '@prisma/client';



// ─────────────────────────────────────────────────────────
// GET /api/warehouse/queue
// Truk berstatus 'arrived' menunggu dipanggil ke dock
// Urutan: urgent → ATA (tracking_logs arrived_at_gate)
// ─────────────────────────────────────────────────────────
export const getArrivedQueue = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.bookings.findMany({
      where: { status: BookingStatus.arrived },
      include: {
        loading_dock: true,
        time_slot: true,
        user: { select: { nama: true, nama_instansi: true } },
        tracking_logs: {
          where: { event_type: EventType.arrived_at_gate },
          orderBy: { timestamp_kejadian: 'asc' },
          take: 1
        }
      }
    });

    // Sort: urgent first, then by ATA timestamp ascending (FIFO)
    const sorted = bookings.sort((a, b) => {
      if (a.priority_level !== b.priority_level) {
        return a.priority_level === 'urgent' ? -1 : 1;
      }
      const ataA = a.tracking_logs[0]?.timestamp_kejadian?.getTime() ?? Infinity;
      const ataB = b.tracking_logs[0]?.timestamp_kejadian?.getTime() ?? Infinity;
      return ataA - ataB;
    });

    return res.status(200).json({ status: 'success', data: sorted });
  } catch (err: any) {
    console.error('[Warehouse Queue Error]', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/warehouse/docks/status
// Status real-time semua dock beserta booking yang aktif
// ─────────────────────────────────────────────────────────
export const getDockStatus = async (req: AuthRequest, res: Response) => {
  try {
    const docks = await prisma.loading_docks.findMany({
      orderBy: { id: 'asc' }
    });

    // Active unloading bookings per dock
    const activeBookings = await prisma.bookings.findMany({
      where: { status: { in: [BookingStatus.arrived, BookingStatus.unloading] } },
      include: {
        user: { select: { nama: true, nama_instansi: true } },
        time_slot: true,
        tracking_logs: {
          where: { event_type: { in: [EventType.arrived_at_gate, EventType.start_unloading] } },
          orderBy: { timestamp_kejadian: 'asc' }
        }
      }
    });

    const bookingByDock: Record<number, typeof activeBookings[0][]> = {};
    for (const b of activeBookings) {
      if (!bookingByDock[b.loading_dock_id]) bookingByDock[b.loading_dock_id] = [];
      bookingByDock[b.loading_dock_id].push(b);
    }

    const result = docks.map(dock => {
      const dockBookings = bookingByDock[dock.id] || [];
      const unloadingBooking = dockBookings.find(b => b.status === BookingStatus.unloading);
      const arrivedBooking = dockBookings.find(b => b.status === BookingStatus.arrived);
      const activeBooking = unloadingBooking || arrivedBooking || null;

      let unloading_since: string | null = null;
      if (unloadingBooking) {
        const startLog = unloadingBooking.tracking_logs.find(
          l => l.event_type === EventType.start_unloading
        );
        if (startLog) unloading_since = startLog.timestamp_kejadian.toISOString();
      }

      return {
        dock,
        status:
          dock.status === LoadingDockStatus.maintenance
            ? 'maintenance'
            : activeBooking
            ? activeBooking.status === BookingStatus.unloading
              ? 'unloading'
              : 'occupied'
            : 'available',
        active_booking: activeBooking
          ? {
              id: activeBooking.id,
              status: activeBooking.status,
              nomor_po: activeBooking.nomor_po,
              plat_nomor_truk: activeBooking.plat_nomor_truk,
              nama_sopir: activeBooking.nama_sopir,
              jenis_armada: activeBooking.jenis_armada,
              supplier: activeBooking.user.nama,
              instansi: activeBooking.user.nama_instansi,
              unloading_since
            }
          : null
      };
    });

    return res.status(200).json({ status: 'success', data: result });
  } catch (err: any) {
    console.error('[Dock Status Error]', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ─────────────────────────────────────────────────────────
// PATCH /api/warehouse/bookings/:id/assign-dock
// Assign atau ganti dock untuk truk yang sudah arrived
// ─────────────────────────────────────────────────────────
export const assignDock = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { loading_dock_id } = req.body;
    const warehouseUserId = req.user!.id;

    if (!loading_dock_id) {
      return res.status(400).json({ status: 'error', message: 'loading_dock_id wajib diisi' });
    }

    const booking = await prisma.bookings.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ status: 'error', message: 'Booking tidak ditemukan' });
    if (booking.status !== BookingStatus.arrived) {
      return res.status(400).json({ status: 'error', message: 'Hanya booking berstatus "arrived" yang bisa di-assign ke dock' });
    }

    const dock = await prisma.loading_docks.findUnique({ where: { id: Number(loading_dock_id) } });
    if (!dock) return res.status(404).json({ status: 'error', message: 'Dock tidak ditemukan' });
    if (dock.status !== LoadingDockStatus.active) {
      return res.status(400).json({ status: 'error', message: `Dock ${dock.nama_dock} sedang maintenance/tidak aktif` });
    }

    // Check if dock is already being used by another unloading booking
    const conflicting = await prisma.bookings.findFirst({
      where: {
        loading_dock_id: Number(loading_dock_id),
        status: { in: [BookingStatus.unloading] },
        id: { not: id }
      }
    });
    if (conflicting) {
      return res.status(409).json({
        status: 'error',
        message: `Dock ${dock.nama_dock} sedang dipakai truk lain (booking #${conflicting.id}) yang sedang bongkar muat`
      });
    }

    const updated = await prisma.bookings.update({
      where: { id },
      data: { loading_dock_id: Number(loading_dock_id) },
      include: { loading_dock: true, time_slot: true, user: { select: { nama: true, nama_instansi: true } } }
    });

    broadcastBookingChanged({
      booking_id: updated.id,
      plat_nomor_truk: updated.plat_nomor_truk,
      status_lama: booking.status,
      status_baru: updated.status,
      loading_dock_id: updated.loading_dock_id,
      timestamp: new Date()
    });
    return res.status(200).json({ status: 'success', data: updated });
  } catch (err: any) {
    console.error('[Assign Dock Error]', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ─────────────────────────────────────────────────────────
// PATCH /api/warehouse/bookings/:id/start-unloading
// Mulai proses bongkar muat
// ─────────────────────────────────────────────────────────
export const startUnloading = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const warehouseUserId = req.user!.id;

    const booking = await prisma.bookings.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ status: 'error', message: 'Booking tidak ditemukan' });
    if (booking.status !== BookingStatus.arrived) {
      return res.status(400).json({
        status: 'error',
        message: `Status tidak valid. Booking harus berstatus "arrived" (saat ini: ${booking.status})`
      });
    }

    const [updated, log] = await prisma.$transaction([
      prisma.bookings.update({
        where: { id },
        data: { status: BookingStatus.unloading },
        include: { loading_dock: true, time_slot: true, user: { select: { nama: true, nama_instansi: true } } }
      }),
      prisma.tracking_logs.create({
        data: {
          booking_id: id,
          event_type: EventType.start_unloading,
          reported_by_user_id: warehouseUserId,
          catatan: 'Bongkar muat dimulai oleh tim gudang'
        }
      })
    ]);

    broadcastBookingChanged({
      booking_id: updated.id,
      plat_nomor_truk: updated.plat_nomor_truk,
      status_lama: booking.status,
      status_baru: updated.status,
      loading_dock_id: updated.loading_dock_id,
      timestamp: new Date()
    });
    return res.status(200).json({ status: 'success', data: updated });
  } catch (err: any) {
    console.error('[Start Unloading Error]', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ─────────────────────────────────────────────────────────
// PATCH /api/warehouse/bookings/:id/complete
// Selesaikan bongkar muat → status 'completed'
// Ini membolehkan checkout di gerbang
// ─────────────────────────────────────────────────────────
export const completeUnloading = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const warehouseUserId = req.user!.id;
    const { catatan } = req.body;

    const booking = await prisma.bookings.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ status: 'error', message: 'Booking tidak ditemukan' });
    if (booking.status !== BookingStatus.unloading) {
      return res.status(400).json({
        status: 'error',
        message: `Booking harus berstatus "unloading" untuk diselesaikan (saat ini: ${booking.status})`
      });
    }

    const [updated, log] = await prisma.$transaction([
      prisma.bookings.update({
        where: { id },
        data: { status: BookingStatus.completed },
        include: { loading_dock: true, time_slot: true, user: { select: { nama: true, nama_instansi: true } } }
      }),
      prisma.tracking_logs.create({
        data: {
          booking_id: id,
          event_type: EventType.finish_unloading,
          reported_by_user_id: warehouseUserId,
          catatan: catatan?.trim() || 'Bongkar muat selesai. Verifikasi kuantitas OK.'
        }
      })
    ]);

    broadcastBookingChanged({
      booking_id: updated.id,
      plat_nomor_truk: updated.plat_nomor_truk,
      status_lama: booking.status,
      status_baru: updated.status,
      loading_dock_id: updated.loading_dock_id,
      timestamp: new Date()
    });
    return res.status(200).json({
      status: 'success',
      message: 'Bongkar muat selesai. Truk kini boleh check-out di gerbang.',
      data: updated
    });
  } catch (err: any) {
    console.error('[Complete Unloading Error]', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// ─────────────────────────────────────────────────────────
// PATCH /api/loading-docks/:id/status
// Toggle dock active ↔ maintenance (admin/warehouse)
// ─────────────────────────────────────────────────────────
export const updateDockStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!['active', 'maintenance'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Status harus "active" atau "maintenance"' });
    }

    // Check for active unloading before closing a dock
    if (status === 'maintenance') {
      const hasActive = await prisma.bookings.findFirst({
        where: {
          loading_dock_id: id,
          status: { in: [BookingStatus.unloading] }
        }
      });
      if (hasActive) {
        return res.status(409).json({
          status: 'error',
          message: 'Dock masih aktif dipakai bongkar muat. Selesaikan terlebih dahulu sebelum menutup dock.'
        });
      }
    }

    const updated = await prisma.loading_docks.update({
      where: { id },
      data: { status: status as LoadingDockStatus }
    });

    broadcastDockChanged({
      loading_dock_id: updated.id,
      status: updated.status
    });
    return res.status(200).json({ status: 'success', data: updated });
  } catch (err: any) {
    if (err.code === 'P2025') return res.status(404).json({ status: 'error', message: 'Dock tidak ditemukan' });
    console.error('[Update Dock Status Error]', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
