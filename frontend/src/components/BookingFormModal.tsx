'use client';

import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import {
  SlotAvailability,
  CreateBookingPayload,
  createBooking,
  Booking,
  JENIS_ARMADA_OPTIONS,
  PLAT_NOMOR_REGEX,
  formatTime,
} from '../lib/booking';

interface BookingFormModalProps {
  selectedDate: string;
  selectedSlot: { dock: SlotAvailability['dock']; slot: SlotAvailability['slots'][0] } | null;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export default function BookingFormModal({ selectedDate, selectedSlot, onClose, onSuccess }: BookingFormModalProps) {
  const [form, setForm] = useState({
    nomor_po: '',
    plat_nomor_truk: '',
    nama_sopir: '',
    jenis_armada: JENIS_ARMADA_OPTIONS[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nomor_po.trim()) e.nomor_po = 'Nomor PO wajib diisi';
    if (!form.plat_nomor_truk.trim()) {
      e.plat_nomor_truk = 'Plat nomor wajib diisi';
    } else if (!PLAT_NOMOR_REGEX.test(form.plat_nomor_truk)) {
      e.plat_nomor_truk = 'Format plat tidak valid (contoh: B 1234 ABC)';
    }
    if (!form.nama_sopir.trim()) e.nama_sopir = 'Nama sopir wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedSlot) return;
    setLoading(true);
    setApiError('');

    try {
      const payload: CreateBookingPayload = {
        loading_dock_id: selectedSlot.dock.id,
        time_slot_id: selectedSlot.slot.slot.id,
        tanggal_booking: selectedDate,
        nomor_po: form.nomor_po.trim(),
        plat_nomor_truk: form.plat_nomor_truk.toUpperCase().replace(/\s+/g, ' ').trim(),
        nama_sopir: form.nama_sopir.trim(),
        jenis_armada: form.jenis_armada,
      };
      const booking = await createBooking(payload);
      onSuccess(booking);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Booking gagal, silakan coba lagi.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-[#1B365D]">Buat Booking Baru</h2>
            {selectedSlot && (
              <p className="text-sm text-gray-500 mt-0.5">
                {selectedSlot.dock.nama_dock} ·{' '}
                {formatTime(selectedSlot.slot.slot.jam_mulai)}–{formatTime(selectedSlot.slot.slot.jam_selesai)}
                {' · '}
                <span className="text-emerald-600 font-medium">{selectedSlot.slot.sisa_kuota} slot tersisa</span>
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {apiError && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <FormField label="Nomor PO" error={errors.nomor_po}>
            <input
              type="text"
              value={form.nomor_po}
              onChange={e => setForm(f => ({ ...f, nomor_po: e.target.value }))}
              placeholder="PO-2024-00123"
              className={inputClass(!!errors.nomor_po)}
            />
          </FormField>

          <FormField label="Plat Nomor Truk" error={errors.plat_nomor_truk}>
            <input
              type="text"
              value={form.plat_nomor_truk}
              onChange={e => setForm(f => ({ ...f, plat_nomor_truk: e.target.value.toUpperCase() }))}
              placeholder="B 1234 ABC"
              className={inputClass(!!errors.plat_nomor_truk)}
            />
          </FormField>

          <FormField label="Nama Sopir" error={errors.nama_sopir}>
            <input
              type="text"
              value={form.nama_sopir}
              onChange={e => setForm(f => ({ ...f, nama_sopir: e.target.value }))}
              placeholder="Budi Santoso"
              className={inputClass(!!errors.nama_sopir)}
            />
          </FormField>

          <FormField label="Jenis Armada">
            <select
              value={form.jenis_armada}
              onChange={e => setForm(f => ({ ...f, jenis_armada: e.target.value }))}
              className={inputClass(false)}
            >
              {JENIS_ARMADA_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </FormField>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1B365D] text-white py-2 rounded-lg hover:bg-[#1B365D]/90 transition font-medium flex justify-center items-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? 'Memproses...' : 'Buat Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-2 border rounded-lg outline-none transition-all text-sm ${
    hasError
      ? 'border-red-400 focus:ring-2 focus:ring-red-300'
      : 'border-gray-300 focus:ring-2 focus:ring-[#1B365D] focus:border-[#1B365D]'
  }`;
}
