'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  fetchAvailableSlots, 
  createBooking, 
  SlotAvailability, 
  JENIS_ARMADA_OPTIONS, 
  PLAT_NOMOR_REGEX, 
  Booking 
} from '@/lib/booking';
import BookingTicketModal from '@/components/BookingTicketModal';
import toast from 'react-hot-toast';

export default function CreateBookingPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [availabilities, setAvailabilities] = useState<SlotAvailability[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    dock: SlotAvailability['dock'];
    slot: SlotAvailability['slots'][0];
  } | null>(null);

  // Form State
  const [form, setForm] = useState({
    nomor_po: '',
    plat_nomor_truk: '',
    nama_sopir: '',
    jenis_armada: JENIS_ARMADA_OPTIONS[0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const loadSlots = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const data = await fetchAvailableSlots(selectedDate);
      setAvailabilities(data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memuat ketersediaan slot');
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error('Silakan pilih Loading Dock dan Time Slot terlebih dahulu.');
      return;
    }
    if (!form.nomor_po.trim()) {
      toast.error('Nomor PO wajib diisi');
      return;
    }
    if (!form.plat_nomor_truk.trim() || !PLAT_NOMOR_REGEX.test(form.plat_nomor_truk)) {
      toast.error('Format plat nomor truk tidak valid (contoh: B 1234 ABC)');
      return;
    }
    if (!form.nama_sopir.trim()) {
      toast.error('Nama sopir wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBooking({
        loading_dock_id: selectedSlot.dock.id,
        time_slot_id: selectedSlot.slot.slot.id,
        tanggal_booking: selectedDate,
        nomor_po: form.nomor_po.trim(),
        plat_nomor_truk: form.plat_nomor_truk.trim().toUpperCase(),
        nama_sopir: form.nama_sopir.trim(),
        jenis_armada: form.jenis_armada,
      });

      toast.success('Booking berhasil dibuat!');
      setCreatedBooking(res);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membuat booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12" data-tour="welcome-banner">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#1B365D]">Buat Reservasi Slot Baru</h1>
          <p className="text-gray-500 text-sm mt-1">Pilih lokasi dock, jam kedatangan, dan isi identitas armada pengiriman.</p>
        </div>
        <div className="flex items-center gap-3" data-tour="booking-date-picker">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Kedatangan:</label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Slot Selection Grid */}
        <div className="lg:col-span-2 space-y-4" data-tour="slot-selection">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1B365D]">calendar_view_day</span>
            Ketersediaan Time Slot per Dock ({selectedDate})
          </h2>

          {loadingSlots ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined animate-spin text-3xl text-[#1B365D]">progress_activity</span>
              <p className="text-sm text-gray-500">Memuat kuota time slot...</p>
            </div>
          ) : availabilities.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">event_busy</span>
              <p className="text-gray-500 font-medium">Tidak ada slot tersedia pada tanggal ini.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {availabilities.map((item) => (
                <div key={item.dock.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                      <h3 className="font-bold text-[#1B365D]">{item.dock.nama_dock}</h3>
                      <p className="text-xs text-gray-500">{item.dock.deskripsi || 'Area loading dock gudang'}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${item.dock.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {item.dock.status === 'active' ? 'Operational' : 'Maintenance'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {item.slots.map((s) => {
                      const isSelected = selectedSlot?.dock.id === item.dock.id && selectedSlot?.slot.slot.id === s.slot.id;
                      const isAvailable = s.tersedia && item.dock.status === 'active';

                      return (
                        <button
                          key={s.slot.id}
                          disabled={!isAvailable}
                          onClick={() => setSelectedSlot({ dock: item.dock, slot: s })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-[#1B365D] bg-[#1B365D] text-white shadow-md ring-2 ring-[#1B365D]/30'
                              : isAvailable
                              ? 'border-gray-200 hover:border-[#1B365D] bg-white text-gray-800'
                              : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#1B365D]'}`}>
                            {s.slot.jam_mulai.slice(0, 5)} - {s.slot.jam_selesai.slice(0, 5)}
                          </p>
                          <div className="flex items-center justify-between mt-2 text-[11px]">
                            <span>Sisa Kuota:</span>
                            <span className={`font-bold ${isSelected ? 'text-emerald-300' : s.sisa_kuota > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {s.sisa_kuota} / {s.kuota_maksimal}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Form Details */}
        <div className="space-y-4" data-tour="booking-form-fields">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 sticky top-20">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1B365D]">edit_document</span>
              Detail Armada & PO
            </h2>

            {selectedSlot ? (
              <div className="p-3 bg-[#1B365D]/5 border border-[#1B365D]/10 rounded-xl space-y-1">
                <p className="text-xs text-[#1B365D] font-bold uppercase tracking-wider">Slot Terpilih:</p>
                <p className="text-sm font-semibold text-gray-800">{selectedSlot.dock.nama_dock}</p>
                <p className="text-xs text-gray-600">
                  {selectedDate} | {selectedSlot.slot.slot.jam_mulai.slice(0, 5)} - {selectedSlot.slot.slot.jam_selesai.slice(0, 5)} WIB
                </p>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                Pilih salah satu time slot yang tersedia di sebelah kiri.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor Purchase Order (PO) *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PO-2026-8891"
                  value={form.nomor_po}
                  onChange={(e) => setForm({ ...form, nomor_po: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Plat Nomor Truk *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: B 9281 UXT"
                  value={form.plat_nomor_truk}
                  onChange={(e) => setForm({ ...form, plat_nomor_truk: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Driver / Sopir *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap sopir"
                  value={form.nama_sopir}
                  onChange={(e) => setForm({ ...form, nama_sopir: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Jenis Armada *</label>
                <select
                  value={form.jenis_armada}
                  onChange={(e) => setForm({ ...form, jenis_armada: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                >
                  {JENIS_ARMADA_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                data-tour="submit-booking-btn"
                className="w-full mt-4 bg-[#1B365D] hover:bg-[#2A4874] disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    <span>Konfirmasi Booking Slot</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Ticket Modal after Success */}
      {createdBooking && (
        <BookingTicketModal
          booking={createdBooking}
          onClose={() => {
            setCreatedBooking(null);
            router.push('/supplier/bookings');
          }}
        />
      )}
    </div>
  );
}
