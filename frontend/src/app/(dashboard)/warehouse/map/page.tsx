'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  fetchDockStatus, 
  updateDockStatusApi, 
  DockStatusItem, 
  getUnloadingDurationMs, 
  formatElapsed 
} from '@/lib/warehouse';
import toast from 'react-hot-toast';

export default function WarehouseMapPage() {
  const [docks, setDocks] = useState<DockStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDock, setSelectedDock] = useState<DockStatusItem | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadDocks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDockStatus();
      setDocks(data || []);
    } catch (err: any) {
      toast.error('Gagal memuat status denah loading dock');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocks();
    const interval = setInterval(loadDocks, 10000);
    return () => clearInterval(interval);
  }, [loadDocks]);

  const handleToggleMaintenance = async (dockItem: DockStatusItem) => {
    const newStatus = dockItem.dock.status === 'active' ? 'maintenance' : 'active';
    setUpdating(true);
    try {
      await updateDockStatusApi(dockItem.dock.id, newStatus);
      toast.success(`Dock ${dockItem.dock.nama_dock} diperbarui ke status ${newStatus}`);
      loadDocks();
      setSelectedDock(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui status dock');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (item: DockStatusItem) => {
    if (item.dock.status === 'maintenance') {
      return { bg: 'bg-gray-100 border-gray-300 text-gray-700', label: 'Perbaikan / Maintenance', color: 'gray' };
    }
    switch (item.status) {
      case 'unloading':
        return { bg: 'bg-amber-100 border-amber-300 text-amber-900', label: 'Bongkar Muat Active', color: 'amber' };
      case 'occupied':
        return { bg: 'bg-blue-100 border-blue-300 text-blue-900', label: 'Terisi Armada', color: 'blue' };
      case 'available':
      default:
        return { bg: 'bg-emerald-100 border-emerald-300 text-emerald-900', label: 'Kosong (Ready)', color: 'emerald' };
    }
  };

  return (
    <div className="space-y-6 pb-12" data-tour="wh-map-header">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#1B365D]">Denah Loading Dock Gudang</h1>
          <p className="text-gray-500 text-sm mt-1">
            Visualisasi tata letak fisik area gudang dan status operasional masing-masing dock secara real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadDocks}
            className="inline-flex items-center gap-2 bg-[#1B365D]/10 hover:bg-[#1B365D]/20 text-[#1B365D] px-4 py-2 rounded-xl font-bold text-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Segarkan Denah</span>
          </button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-6 text-xs font-semibold text-gray-700">
        <span className="text-gray-400 uppercase tracking-wider font-bold">Legenda Denah:</span>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
          <span>Kosong (Ready)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500"></div>
          <span>Proses Bongkar Muat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-500"></div>
          <span>Terisi / Menunggu</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-gray-400"></div>
          <span>Maintenance</span>
        </div>
      </div>

      {/* Grid Layout of Warehouse Docks */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4" data-tour="wh-map-grid">
        <h2 className="text-lg font-bold text-[#1B365D] flex items-center gap-2">
          <span className="material-symbols-outlined">map</span>
          Warehouse Bay & Dock Grid
        </h2>

        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-3xl text-[#1B365D]">progress_activity</span>
            <p className="text-sm">Memuat peta loading dock...</p>
          </div>
        ) : docks.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-2">dashboard_customize</span>
            <p className="text-gray-600 font-medium">Belum ada data loading dock terdaftar di sistem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {docks.map((item) => {
              const badge = getStatusBadge(item);
              const active = item.active_booking;
              const elapsedMs = active?.unloading_since ? getUnloadingDurationMs(active.unloading_since) : 0;

              return (
                <div
                  key={item.dock.id}
                  onClick={() => setSelectedDock(item)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md relative flex flex-col justify-between h-56 ${badge.bg}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-extrabold">{item.dock.nama_dock}</h3>
                      <span className="material-symbols-outlined text-2xl">
                        {item.dock.status === 'maintenance' ? 'build' : active ? 'local_shipping' : 'meeting_room'}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block">
                      {badge.label}
                    </span>
                  </div>

                  {active ? (
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl space-y-1 text-xs text-gray-800 border border-black/5">
                      <p className="font-bold text-[#1B365D] truncate">{active.nomor_po}</p>
                      <p className="font-semibold text-gray-900">{active.plat_nomor_truk} ({active.jenis_armada})</p>
                      <p className="text-gray-600 truncate">{active.supplier}</p>
                      {active.unloading_since && (
                        <div className="flex items-center gap-1 text-amber-700 font-bold mt-1 text-[11px]">
                          <span className="material-symbols-outlined text-[14px]">timer</span>
                          <span>Durasi: {formatElapsed(elapsedMs)}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 italic py-4">
                      {item.dock.status === 'maintenance'
                        ? 'Dock sedang dalam perbaikan teknis.'
                        : 'Tidak ada armada terparkir di dock ini.'}
                    </div>
                  )}

                  <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-bold">
                    <span>Kapasitas: {item.dock.kapasitas_maksimal || 1} Truk</span>
                    <span className="underline hover:text-black">Detail & Detail &gt;</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dock Detail Modal */}
      {selectedDock && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-xl font-bold text-[#1B365D]">{selectedDock.dock.nama_dock}</h3>
                <p className="text-xs text-gray-500">{selectedDock.dock.deskripsi || 'Loading Dock Gudang'}</p>
              </div>
              <button
                onClick={() => setSelectedDock(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Status Operasional:</span>
                <span className="font-bold capitalize">{selectedDock.dock.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Status Parkir:</span>
                <span className="font-bold capitalize">{selectedDock.status}</span>
              </div>

              {selectedDock.active_booking && (
                <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs">
                  <p className="font-bold text-[#1B365D] border-b border-gray-200 pb-1">Armada Aktif:</p>
                  <p><span className="text-gray-500">Nomor PO:</span> <strong>{selectedDock.active_booking.nomor_po}</strong></p>
                  <p><span className="text-gray-500">Plat Nomor:</span> <strong>{selectedDock.active_booking.plat_nomor_truk}</strong></p>
                  <p><span className="text-gray-500">Sopir:</span> <strong>{selectedDock.active_booking.nama_sopir}</strong></p>
                  <p><span className="text-gray-500">Supplier:</span> <strong>{selectedDock.active_booking.supplier}</strong></p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => handleToggleMaintenance(selectedDock)}
                disabled={updating}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs text-white transition-colors ${
                  selectedDock.dock.status === 'active'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {selectedDock.dock.status === 'active' ? 'Set Status Maintenance' : 'Set Status Operational'}
              </button>
              <button
                onClick={() => setSelectedDock(null)}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
