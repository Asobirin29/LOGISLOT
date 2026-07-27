import api from './axios';

export type DockStatus = 'available' | 'occupied' | 'unloading' | 'maintenance';

export interface ActiveBookingOnDock {
  id: number;
  status: string;
  nomor_po: string;
  plat_nomor_truk: string;
  nama_sopir: string;
  jenis_armada: string;
  supplier: string;
  instansi: string;
  unloading_since: string | null;
}

export interface DockStatusItem {
  dock: {
    id: number;
    nama_dock: string;
    deskripsi?: string;
    kapasitas_maksimal: number;
    status: 'active' | 'maintenance';
  };
  status: DockStatus;
  active_booking: ActiveBookingOnDock | null;
}

export interface ArrivedBooking {
  id: number;
  nomor_po: string;
  plat_nomor_truk: string;
  nama_sopir: string;
  jenis_armada: string;
  status: string;
  priority_level: string;
  loading_dock_id: number;
  loading_dock: { id: number; nama_dock: string };
  time_slot: { jam_mulai: string; jam_selesai: string };
  user: { nama: string; nama_instansi: string };
  tracking_logs: Array<{ event_type: string; timestamp_kejadian: string }>;
}

// ── API ──────────────────────────────────────────────────

export const fetchArrivedQueue = async (): Promise<ArrivedBooking[]> => {
  const res = await api.get('/warehouse/queue');
  return res.data.data;
};

export const fetchDockStatus = async (): Promise<DockStatusItem[]> => {
  const res = await api.get('/warehouse/docks/status');
  return res.data.data;
};

export const assignDockApi = async (bookingId: number, loading_dock_id: number): Promise<void> => {
  await api.patch(`/warehouse/bookings/${bookingId}/assign-dock`, { loading_dock_id });
};

export const startUnloadingApi = async (bookingId: number): Promise<void> => {
  await api.patch(`/warehouse/bookings/${bookingId}/start-unloading`);
};

export const completeUnloadingApi = async (bookingId: number, catatan?: string): Promise<void> => {
  await api.patch(`/warehouse/bookings/${bookingId}/complete`, { catatan });
};

export const updateDockStatusApi = async (dockId: number, status: 'active' | 'maintenance'): Promise<void> => {
  await api.patch(`/warehouse/docks/${dockId}/status`, { status });
};

// ── Helpers ──────────────────────────────────────────────

export const OVERSTAY_THRESHOLD_MINUTES = 90;

/** How long (in ms) a booking has been in unloading state */
export const getUnloadingDurationMs = (unloading_since: string | null): number => {
  if (!unloading_since) return 0;
  return Date.now() - new Date(unloading_since).getTime();
};

/** Returns HH:MM:SS elapsed time string */
export const formatElapsed = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [
    h > 0 ? String(h).padStart(2, '0') + ':' : '',
    String(m).padStart(2, '0') + ':',
    String(s).padStart(2, '0')
  ].join('');
};

export const formatTimeWIB = (iso: string): string =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });

export const formatDateWIB = (iso: string): string =>
  new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: 'Asia/Jakarta' });

export const getATATime = (booking: ArrivedBooking): string | null => {
  const log = booking.tracking_logs?.find(l => l.event_type === 'arrived_at_gate');
  return log?.timestamp_kejadian || null;
};
