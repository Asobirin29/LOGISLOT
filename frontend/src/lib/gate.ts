import api from './axios';

export interface ScanResult {
  status: 'success' | 'error';
  event?: 'CHECK_IN' | 'CHECK_OUT';
  out_of_tolerance?: boolean;
  early?: boolean;
  late?: boolean;
  selisih_menit?: number;
  message?: string;
  current_status?: string;
  data?: {
    booking_id: number;
    kode_qr?: string;
    status?: string;
    nomor_po?: string;
    plat_nomor_truk: string;
    nama_sopir?: string;
    jenis_armada?: string;
    supplier?: string;
    instansi?: string;
    loading_dock?: string;
    jadwal_slot?: string;
    waktu_aktual?: string;
    waktu_checkout?: string;
    waktu_tiba?: string;
    turnaround_menit?: number | null;
    timestamp_log?: string;
  };
}

export interface QueueBooking {
  id: number;
  nomor_po: string;
  plat_nomor_truk: string;
  nama_sopir: string;
  jenis_armada: string;
  status: string;
  priority_level: string;
  time_slot: { jam_mulai: string; jam_selesai: string };
  loading_dock: { nama_dock: string };
  user: { nama: string; nama_instansi: string };
}

export const scanQR = async (kode_qr: string): Promise<ScanResult> => {
  try {
    const res = await api.post('/gate/scan', { kode_qr });
    return res.data;
  } catch (err: any) {
    return err.response?.data as ScanResult || { status: 'error', message: 'Gagal menghubungi server' };
  }
};

export const manualCheckin = async (plat_nomor_truk: string, tanggal?: string): Promise<ScanResult> => {
  try {
    const res = await api.post('/gate/manual-checkin', { plat_nomor_truk, tanggal });
    return res.data;
  } catch (err: any) {
    return err.response?.data as ScanResult || { status: 'error', message: 'Gagal menghubungi server' };
  }
};

export const fetchQueue = async (): Promise<QueueBooking[]> => {
  const res = await api.get('/gate/queue');
  return res.data.data;
};

export const formatTimeWIB = (iso: string) => {
  return new Date(iso).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta'
  });
};

export const playScanSound = (success: boolean) => {
  if (typeof window === 'undefined') return;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = success ? 880 : 220;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (success ? 0.3 : 0.6));
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.6);
};

export const triggerVibration = (success: boolean) => {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  navigator.vibrate(success ? [100] : [100, 50, 100, 50, 200]);
};
