import api from './axios';

// --- Types ---
export interface TimeSlot {
  id: number;
  jam_mulai: string;
  jam_selesai: string;
  kuota_maksimal: number;
}

export interface LoadingDock {
  id: number;
  nama_dock: string;
  deskripsi?: string;
  kapasitas_maksimal: number;
  status: 'active' | 'maintenance';
}

export interface SlotAvailability {
  dock: LoadingDock;
  slots: Array<{
    slot: TimeSlot;
    kuota_maksimal: number;
    booked: number;
    sisa_kuota: number;
    tersedia: boolean;
  }>;
}

export type BookingStatus = 'booked' | 'arrived' | 'unloading' | 'completed' | 'cancelled';

export interface Booking {
  id: number;
  user_id: number;
  loading_dock_id: number;
  time_slot_id: number;
  tanggal_booking: string;
  nomor_po: string;
  plat_nomor_truk: string;
  nama_sopir: string;
  jenis_armada: string;
  kode_qr: string;
  status: BookingStatus;
  created_at: string;
  loading_dock: LoadingDock;
  time_slot: TimeSlot;
}

export interface CreateBookingPayload {
  loading_dock_id: number;
  time_slot_id: number;
  tanggal_booking: string;
  nomor_po: string;
  plat_nomor_truk: string;
  nama_sopir: string;
  jenis_armada: string;
}

// --- API Functions ---
export const fetchAvailableSlots = async (tanggal: string): Promise<SlotAvailability[]> => {
  const res = await api.get(`/slots/available?tanggal=${tanggal}`);
  return res.data.data;
};

export const createBooking = async (payload: CreateBookingPayload): Promise<Booking> => {
  const res = await api.post('/bookings', payload);
  return res.data.data;
};

export const fetchMyBookings = async (filters?: { status?: string; tanggal?: string }): Promise<Booking[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.tanggal) params.set('tanggal', filters.tanggal);
  const res = await api.get(`/bookings/my?${params.toString()}`);
  return res.data.data;
};

export const rescheduleBooking = async (
  id: number,
  payload: { time_slot_id?: number; tanggal_booking?: string; loading_dock_id?: number }
): Promise<Booking> => {
  const res = await api.patch(`/bookings/${id}`, payload);
  return res.data.data;
};

export const cancelBooking = async (id: number): Promise<Booking> => {
  const res = await api.delete(`/bookings/${id}`);
  return res.data.data;
};

// --- Helpers ---
export const formatTime = (isoTime: string) => {
  const d = new Date(isoTime);
  return d.toUTCString().slice(17, 22); // "HH:MM"
};

export const formatDate = (isoDate: string) => {
  const d = new Date(isoDate);
  return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

export const statusColors: Record<BookingStatus, { bg: string; text: string; label: string }> = {
  booked:    { bg: 'bg-[#1B365D]',  text: 'text-white', label: 'Booked' },
  arrived:   { bg: 'bg-amber-400',  text: 'text-white', label: 'Arrived' },
  unloading: { bg: 'bg-amber-500',  text: 'text-white', label: 'Unloading' },
  completed: { bg: 'bg-emerald-500', text: 'text-white', label: 'Selesai' },
  cancelled: { bg: 'bg-gray-400',   text: 'text-white', label: 'Dibatalkan' },
};

export const JENIS_ARMADA_OPTIONS = [
  'Truk Box',
  'Truk Engkel',
  'Truk Fuso',
  'Trailer',
  'Pickup',
  'Truk CDD',
];

export const PLAT_NOMOR_REGEX = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/i;

/**
 * Returns true if cancel/reschedule is still allowed
 * (at least 4 hours before the slot start)
 */
export const isActionAllowed = (booking: Booking): boolean => {
  if (booking.status !== 'booked') return false;
  const slotStart = new Date(booking.time_slot.jam_mulai);
  const bookingDay = new Date(booking.tanggal_booking);
  const slotDateTime = new Date(bookingDay);
  slotDateTime.setUTCHours(slotStart.getUTCHours(), slotStart.getUTCMinutes(), 0, 0);
  const now = new Date();
  return slotDateTime.getTime() - now.getTime() > 4 * 60 * 60 * 1000;
};
