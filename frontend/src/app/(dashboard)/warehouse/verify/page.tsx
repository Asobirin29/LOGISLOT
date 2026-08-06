'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  fetchDockStatus, 
  completeUnloadingApi, 
  DockStatusItem, 
  getUnloadingDurationMs, 
  formatElapsed 
} from '@/lib/warehouse';
import toast from 'react-hot-toast';

export default function WarehouseVerifyPage() {
  const [docks, setDocks] = useState<DockStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DockStatusItem | null>(null);
  
  // Inspection Form State
  const [checklist, setChecklist] = useState({
    poMatch: true,
    sealIntact: true,
    quantityVerified: true,
    conditionGood: true,
  });
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadUnloadingArmadas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDockStatus();
      setDocks(data || []);
    } catch (err: any) {
      toast.error('Gagal memuat data verifikasi bongkar muat');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUnloadingArmadas();
  }, [loadUnloadingArmadas]);

  const activeUnloadingItems = docks.filter(
    (d) => d.status === 'unloading' || d.status === 'occupied' || (d.active_booking && d.active_booking.status === 'unloading')
  );

  const handleCompleteVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !selectedItem.active_booking) return;

    if (!checklist.poMatch || !checklist.sealIntact || !checklist.quantityVerified || !checklist.conditionGood) {
      if (!catatan.trim()) {
        toast.error('Karena terdapat poin inspeksi yang gagal, mohon isi Catatan Inspeksi.');
        return;
      }
    }

    setSubmitting(true);
    try {
      await completeUnloadingApi(selectedItem.active_booking.id, catatan.trim());
      toast.success(`Verifikasi bongkar muat PO ${selectedItem.active_booking.nomor_po} berhasil diselesaikan!`);
      setSelectedItem(null);
      setCatatan('');
      loadUnloadingArmadas();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyelesaikan verifikasi bongkar muat');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12" data-tour="wh-verify-header">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#1B365D]">Verifikasi & Inspeksi Bongkar Muat</h1>
          <p className="text-gray-500 text-sm mt-1">
            Lakukan inspeksi kelengkapan fisik, kesesuaian dokumen PO, dan verifikasi muatan sebelum disetujui selesai.
          </p>
        </div>
        <button
          onClick={loadUnloadingArmadas}
          className="inline-flex items-center gap-2 bg-[#1B365D]/10 hover:bg-[#1B365D]/20 text-[#1B365D] px-4 py-2 rounded-xl font-bold text-sm transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Grid of Active Unloading Armadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Unloading List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1B365D]">verified</span>
            Armada Dalam Proses Bongkar ({activeUnloadingItems.length})
          </h2>

          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-3xl text-[#1B365D]">progress_activity</span>
              <p className="text-sm text-gray-500">Memuat armada aktif...</p>
            </div>
          ) : activeUnloadingItems.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">task_alt</span>
              <p className="text-gray-600 font-medium">Saat ini tidak ada armada yang sedang melakukan proses bongkar muat.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeUnloadingItems.map((item) => {
                const b = item.active_booking!;
                const isSelected = selectedItem?.dock.id === item.dock.id;
                const elapsedMs = b.unloading_since ? getUnloadingDurationMs(b.unloading_since) : 0;

                return (
                  <div
                    key={item.dock.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-[#1B365D] ring-2 ring-[#1B365D]/20 bg-[#1B365D]/5'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#1B365D] text-white font-bold text-xs">
                          {item.dock.nama_dock}
                        </span>
                        <h3 className="font-bold text-[#1B365D] text-base">{b.nomor_po}</h3>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {b.plat_nomor_truk} — <span className="text-gray-600 font-normal">{b.nama_sopir} ({b.jenis_armada})</span>
                      </p>
                      <p className="text-xs text-gray-500">{b.supplier} ({b.instansi || 'Supplier'})</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      {b.unloading_since && (
                        <div className="text-right">
                          <p className="text-[11px] text-gray-400 uppercase font-bold">Waktu Bongkar:</p>
                          <p className="text-sm font-bold text-amber-700">{formatElapsed(elapsedMs)}</p>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-[#1B365D] text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        Inspeksi & Verifikasi
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Verification Inspection Form */}
        <div className="space-y-4" data-tour="wh-verify-form">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 sticky top-20">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1B365D]">fact_check</span>
              Form Checklist Verifikasi
            </h2>

            {selectedItem && selectedItem.active_booking ? (
              <form onSubmit={handleCompleteVerification} className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs">
                  <p className="font-bold text-[#1B365D]">{selectedItem.dock.nama_dock}</p>
                  <p className="text-gray-700">PO: <strong>{selectedItem.active_booking.nomor_po}</strong></p>
                  <p className="text-gray-600">Truk: {selectedItem.active_booking.plat_nomor_truk} ({selectedItem.active_booking.nama_sopir})</p>
                </div>

                <div className="space-y-3 border-t border-b border-gray-100 py-3">
                  <label className="flex items-center gap-3 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.poMatch}
                      onChange={(e) => setChecklist({ ...checklist, poMatch: e.target.checked })}
                      className="w-4 h-4 text-[#1B365D] rounded focus:ring-[#1B365D]"
                    />
                    <span>1. Dokumen PO & Surat Jalan Sesuai</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.sealIntact}
                      onChange={(e) => setChecklist({ ...checklist, sealIntact: e.target.checked })}
                      className="w-4 h-4 text-[#1B365D] rounded focus:ring-[#1B365D]"
                    />
                    <span>2. Segel Truk / Container Utuh & Sesuai</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.quantityVerified}
                      onChange={(e) => setChecklist({ ...checklist, quantityVerified: e.target.checked })}
                      className="w-4 h-4 text-[#1B365D] rounded focus:ring-[#1B365D]"
                    />
                    <span>3. Jumlah Fisik Barang Cocok Dengan Manifes</span>
                  </label>

                  <label className="flex items-center gap-3 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.conditionGood}
                      onChange={(e) => setChecklist({ ...checklist, conditionGood: e.target.checked })}
                      className="w-4 h-4 text-[#1B365D] rounded focus:ring-[#1B365D]"
                    />
                    <span>4. Kemasan / Kemulusan Barang Baik (Tidak Rusak)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Catatan Inspeksi Gudang:</label>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan catatan kondisi muatan atau alasan ketidaksesuaian..."
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                      <span>Selesaikan & Disetujui (Complete)</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs italic">
                Pilih salah satu armada di sebelah kiri untuk memulai proses verifikasi bongkar muat.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
