import api from './axios';

export type PriorityLevel = 'normal' | 'urgent';

export interface TrackingLog {
  id: number;
  event_type: string;
  timestamp_kejadian: string;
  catatan?: string;
}

export interface ICBooking {
  id: number;
  nomor_po: string;
  plat_nomor_truk: string;
  nama_sopir: string;
  jenis_armada: string;
  tanggal_booking: string;
  kode_qr: string;
  status: string;
  priority_level: PriorityLevel;
  created_at: string;
  loading_dock: { id: number; nama_dock: string };
  time_slot: { id: number; jam_mulai: string; jam_selesai: string };
  user: { id: number; nama: string; nama_instansi: string; email: string };
  tracking_logs: TrackingLog[];
}

export interface SlaSummary {
  supplier_id: number;
  supplier_nama: string;
  instansi: string;
  tepat_waktu: number;
  terlambat: number;
  lebih_awal: number;
  total: number;
  rata_rata_selisih_menit: number | null;
  pct_tepat_waktu: number;
}

export interface SlaDetail {
  booking_id: number;
  nomor_po: string;
  supplier: string;
  instansi: string;
  tanggal: string;
  jadwal_slot: string;
  waktu_tiba: string | null;
  selisih_menit: number | null;
  kategori: 'tepat_waktu' | 'terlambat' | 'lebih_awal' | 'tidak_ada_data';
}

export interface SlaReport {
  summary: SlaSummary[];
  details: SlaDetail[];
  meta: {
    date_from: string | null;
    date_to: string | null;
    total_bookings_analyzed: number;
    tolerance_minutes: number;
  };
}

export const fetchICBookings = async (filters?: {
  tanggal?: string;
  status?: string;
  loading_dock_id?: number;
  nomor_po?: string;
}): Promise<ICBooking[]> => {
  const params = new URLSearchParams();
  if (filters?.tanggal) params.set('tanggal', filters.tanggal);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.loading_dock_id) params.set('loading_dock_id', String(filters.loading_dock_id));
  if (filters?.nomor_po) params.set('nomor_po', filters.nomor_po);
  const res = await api.get(`/ic/bookings?${params.toString()}`);
  return res.data.data;
};

export const updatePriority = async (id: number, priority_level: PriorityLevel): Promise<ICBooking> => {
  const res = await api.patch(`/ic/bookings/${id}/priority`, { priority_level });
  return res.data.data;
};

export const fetchSlaReport = async (filters?: {
  date_from?: string;
  date_to?: string;
}): Promise<SlaReport> => {
  const params = new URLSearchParams();
  if (filters?.date_from) params.set('date_from', filters.date_from);
  if (filters?.date_to) params.set('date_to', filters.date_to);
  const res = await api.get(`/reports/sla?${params.toString()}`);
  return res.data.data;
};

export const formatTime = (isoTime: string) => {
  const d = new Date(isoTime);
  return d.toISOString().slice(11, 16);
};

export const formatDate = (isoDate: string) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getSlotDeadlineStatus = (
  tanggalBooking: string,
  jamMulai: string
): 'urgent' | 'warning' | 'normal' => {
  const slotDt = new Date(tanggalBooking);
  const slot = new Date(jamMulai);
  slotDt.setUTCHours(slot.getUTCHours(), slot.getUTCMinutes(), 0, 0);
  const diffMs = slotDt.getTime() - Date.now();
  const diffMinutes = diffMs / 60000;
  if (diffMinutes < 0) return 'urgent'; // already past slot
  if (diffMinutes < 60) return 'warning'; // less than 1 hour away
  return 'normal';
};
