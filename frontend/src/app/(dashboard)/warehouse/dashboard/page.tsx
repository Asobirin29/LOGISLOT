'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { useAuth } from '../../../../context/AuthContext';
import {
  fetchArrivedQueue,
  fetchDockStatus,
  assignDockApi,
  startUnloadingApi,
  completeUnloadingApi,
  updateDockStatusApi,
  DockStatusItem,
  ArrivedBooking,
  OVERSTAY_THRESHOLD_MINUTES,
  getUnloadingDurationMs,
  formatElapsed,
  formatTimeWIB,
  getATATime,
} from '../../../../lib/warehouse';
import { useSocket } from '../../../../lib/useSocket';
import {
  Package, Truck, CheckCircle2, PlayCircle, AlertTriangle,
  Wrench, ZapIcon, LogOut, RefreshCw, X, CheckCheck, Clock
} from 'lucide-react';

export default function WarehouseDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['warehouse', 'admin']}>
      <WarehouseDashboard />
    </ProtectedRoute>
  );
}

function WarehouseDashboard() {
  const { user, logout } = useAuth();
  const [docks, setDocks] = useState<DockStatusItem[]>([]);
  const [queue, setQueue] = useState<ArrivedBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [tick, setTick] = useState(0); // for realtime clock refresh
  const [completeModal, setCompleteModal] = useState<{ id: number; plat: string } | null>(null);
  const [catatanVerifikasi, setCatatanVerifikasi] = useState('');
  const [assignModal, setAssignModal] = useState<{ bookingId: number; plat: string } | null>(null);
  const [selectedDockId, setSelectedDockId] = useState<number | ''>('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dockData, queueData] = await Promise.all([fetchDockStatus(), fetchArrivedQueue()]);
      setDocks(dockData);
      setQueue(queueData);
    } catch (e) {
      console.error('Load failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time WebSocket updates
  useSocket({
    'booking:status_changed': useCallback(() => loadAll(), [loadAll]),
    'dock:status_changed': useCallback(() => loadAll(), [loadAll])
  });

  // Initial load
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // 1-second tick for elapsed timers
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const handleAssignDock = async () => {
    if (!assignModal || !selectedDockId) return;
    setActionLoading(assignModal.bookingId);
    setErrorMsg('');
    try {
      await assignDockApi(assignModal.bookingId, Number(selectedDockId));
      setAssignModal(null);
      setSelectedDockId('');
      await loadAll();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal assign dock');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartUnloading = async (id: number) => {
    setActionLoading(id);
    try {
      await startUnloadingApi(id);
      await loadAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memulai bongkar');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async () => {
    if (!completeModal) return;
    setActionLoading(completeModal.id);
    try {
      await completeUnloadingApi(completeModal.id, catatanVerifikasi);
      setCompleteModal(null);
      setCatatanVerifikasi('');
      await loadAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyelesaikan bongkar');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDockToggle = async (dockId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'maintenance' ? 'active' : 'maintenance';
    const label = newStatus === 'maintenance' ? 'Tutup (Maintenance)' : 'Buka Kembali';
    if (!confirm(`${label} Dock ini?`)) return;
    try {
      await updateDockStatusApi(dockId, newStatus as 'active' | 'maintenance');
      await loadAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal ubah status dock');
    }
  };

  // Available docks (active + not currently unloading)
  const availableDocks = docks.filter(d => d.status === 'available');
  const stats = {
    total_docks: docks.length,
    available: docks.filter(d => d.status === 'available').length,
    busy: docks.filter(d => d.status === 'unloading' || d.status === 'occupied').length,
    maintenance: docks.filter(d => d.status === 'maintenance').length,
    queue: queue.length,
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans">
      {/* Navbar */}
      <nav className="bg-[#1B365D] text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Package size={22} className="text-blue-300" />
          <span className="text-lg font-black tracking-tight">LOGISLOT</span>
          <span className="ml-2 px-2 py-0.5 bg-blue-800/60 rounded text-xs font-medium">Gudang</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <span className="text-blue-200 text-sm hidden sm:block">{user?.nama}</span>
          <button onClick={logout} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition">
            <LogOut size={14} />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stat Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Dock', val: stats.total_docks, color: 'bg-[#1B365D]' },
            { label: 'Tersedia', val: stats.available, color: 'bg-emerald-500' },
            { label: 'Sedang Pakai', val: stats.busy, color: 'bg-amber-500' },
            { label: 'Maintenance', val: stats.maintenance, color: 'bg-gray-400' },
            { label: 'Antrian Tiba', val: stats.queue, color: 'bg-blue-600' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl px-4 py-3 text-white`}>
              <p className="text-2xl font-black">{s.val}</p>
              <p className="text-xs opacity-80 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ─── DOCK GRID (Denah) ─── */}
        <div>
          <h2 className="text-base font-bold text-[#1B365D] mb-3 flex items-center gap-2">
            <Package size={16} />
            Denah Loading Dock
            <span className="text-xs font-normal text-emerald-600 flex items-center gap-1 ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Updates
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {docks.map(item => (
              <DockCard
                key={item.dock.id}
                item={item}
                tick={tick}
                onToggleMaintenance={() => handleDockToggle(item.dock.id, item.dock.status)}
                onStartUnloading={handleStartUnloading}
                onComplete={b => setCompleteModal({ id: b.id, plat: b.plat_nomor_truk })}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        </div>

        {/* ─── ARRIVED QUEUE ─── */}
        <div>
          <h2 className="text-base font-bold text-[#1B365D] mb-3 flex items-center gap-2">
            <Truck size={16} />
            Antrian Truk Sudah Tiba
            <span className="text-sm font-normal text-gray-400">({queue.length} truk menunggu)</span>
          </h2>
          {queue.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border border-gray-100">
              <Truck size={36} className="mx-auto mb-2 opacity-30" />
              <p>Tidak ada truk yang menunggu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((booking, idx) => {
                const ata = getATATime(booking);
                const waitMs = ata ? Date.now() - new Date(ata).getTime() : 0;

                return (
                  <div
                    key={booking.id}
                    className={`bg-white rounded-2xl shadow-sm border p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                      booking.priority_level === 'urgent' ? 'border-red-300 bg-red-50/30' : 'border-gray-100'
                    }`}
                  >
                    {/* Rank badge */}
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                      booking.priority_level === 'urgent'
                        ? 'bg-red-500 text-white'
                        : 'bg-[#1B365D]/10 text-[#1B365D]'
                    }`}>
                      {booking.priority_level === 'urgent' ? <ZapIcon size={18} /> : idx + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-gray-800 text-base">{booking.plat_nomor_truk}</span>
                        {booking.priority_level === 'urgent' && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white flex items-center gap-1">
                            <ZapIcon size={9} /> Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{booking.user.nama} · {booking.user.nama_instansi}</p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                        <span>{booking.loading_dock.nama_dock}</span>
                        <span>{booking.jenis_armada}</span>
                        <span>PO: {booking.nomor_po}</span>
                        {ata && (
                          <span className="flex items-center gap-1 text-amber-600 font-medium">
                            <Clock size={10} />
                            Tiba: {formatTimeWIB(ata)} · Menunggu {formatElapsed(waitMs)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => {
                        setAssignModal({ bookingId: booking.id, plat: booking.plat_nomor_truk });
                        setSelectedDockId('');
                        setErrorMsg('');
                      }}
                      disabled={availableDocks.length === 0 || actionLoading === booking.id}
                      className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#1B365D] text-white rounded-xl hover:bg-[#1B365D]/90 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium text-sm"
                    >
                      <Package size={16} />
                      Panggil ke Dock
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── ASSIGN DOCK MODAL ─── */}
      {assignModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h3 className="font-bold text-[#1B365D]">Panggil ke Dock</h3>
                <p className="text-sm text-gray-500">{assignModal.plat}</p>
              </div>
              <button onClick={() => setAssignModal(null)} className="p-1.5 rounded-full hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
                  <AlertTriangle size={14} />
                  {errorMsg}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Loading Dock</label>
                <select
                  value={selectedDockId}
                  onChange={e => setSelectedDockId(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B365D] outline-none text-sm"
                >
                  <option value="">-- Pilih Dock --</option>
                  {availableDocks.map(d => (
                    <option key={d.dock.id} value={d.dock.id}>
                      {d.dock.nama_dock}
                      {d.dock.deskripsi ? ` (${d.dock.deskripsi})` : ''}
                    </option>
                  ))}
                </select>
                {availableDocks.length === 0 && (
                  <p className="mt-1 text-xs text-red-500">Semua dock sedang penuh atau maintenance</p>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setAssignModal(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">
                  Batal
                </button>
                <button
                  onClick={handleAssignDock}
                  disabled={!selectedDockId || actionLoading !== null}
                  className="flex-1 py-2.5 bg-[#1B365D] text-white rounded-xl text-sm font-medium hover:bg-[#1B365D]/90 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {actionLoading !== null ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── COMPLETE MODAL ─── */}
      {completeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h3 className="font-bold text-emerald-700">Selesaikan Bongkar Muat</h3>
                <p className="text-sm text-gray-500">{completeModal.plat}</p>
              </div>
              <button onClick={() => setCompleteModal(null)} className="p-1.5 rounded-full hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
                ℹ️ Setelah dikonfirmasi, truk bisa melakukan <strong>check-out</strong> di gerbang.
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Verifikasi Kuantitas (opsional)</label>
                <textarea
                  value={catatanVerifikasi}
                  onChange={e => setCatatanVerifikasi(e.target.value)}
                  placeholder="Contoh: Barang sesuai PO, 250 karton OK"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCompleteModal(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">
                  Batal
                </button>
                <button
                  onClick={handleComplete}
                  disabled={actionLoading !== null}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {actionLoading !== null
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <CheckCheck size={16} />}
                  Konfirmasi Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DOCK CARD
// ═══════════════════════════════════════════════════════
function DockCard({
  item, tick, onToggleMaintenance, onStartUnloading, onComplete, actionLoading
}: {
  item: DockStatusItem;
  tick: number;
  onToggleMaintenance: () => void;
  onStartUnloading: (id: number) => void;
  onComplete: (b: { id: number; plat_nomor_truk: string }) => void;
  actionLoading: number | null;
}) {
  const { dock, status, active_booking: ab } = item;

  const unloadingMs = status === 'unloading' && ab?.unloading_since
    ? getUnloadingDurationMs(ab.unloading_since)
    : 0;
  const isOverstay = unloadingMs > OVERSTAY_THRESHOLD_MINUTES * 60 * 1000;

  // Color scheme per status
  const cardStyle =
    dock.status === 'maintenance'
      ? 'bg-gray-100 border-gray-300'
      : isOverstay
      ? 'bg-red-50 border-red-400 shadow-red-100'
      : status === 'unloading'
      ? 'bg-amber-50 border-amber-400'
      : status === 'occupied'
      ? 'bg-blue-50 border-blue-300'
      : 'bg-emerald-50 border-emerald-300';

  const headerBg =
    dock.status === 'maintenance'
      ? 'bg-gray-400'
      : isOverstay
      ? 'bg-red-500'
      : status === 'unloading'
      ? 'bg-amber-500'
      : status === 'occupied'
      ? 'bg-blue-500'
      : 'bg-emerald-500';

  const statusLabel =
    dock.status === 'maintenance'
      ? 'Maintenance'
      : status === 'unloading'
      ? 'Bongkar Muat'
      : status === 'occupied'
      ? 'Truk Tiba'
      : 'Tersedia';

  return (
    <div className={`rounded-2xl border-2 overflow-hidden shadow-sm transition-all ${cardStyle}`}>
      {/* Header */}
      <div className={`${headerBg} px-4 py-3 flex items-center justify-between`}>
        <div>
          <p className="font-black text-white text-sm">{dock.nama_dock}</p>
          <p className="text-white/80 text-xs">{statusLabel}</p>
        </div>
        {isOverstay && (
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
            <AlertTriangle size={12} className="text-white" />
            <span className="text-white text-xs font-bold">OVERSTAY</span>
          </div>
        )}
        {dock.status === 'maintenance' && (
          <Wrench size={18} className="text-white/70" />
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {status === 'available' && dock.status !== 'maintenance' && (
          <div className="text-center py-4">
            <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-1" />
            <p className="text-emerald-700 font-semibold text-sm">Kosong · Siap Digunakan</p>
          </div>
        )}

        {dock.status === 'maintenance' && (
          <div className="text-center py-4">
            <Wrench size={32} className="text-gray-400 mx-auto mb-1" />
            <p className="text-gray-500 text-sm">Sedang Maintenance</p>
          </div>
        )}

        {ab && dock.status !== 'maintenance' && (
          <div className="space-y-2">
            <p className="font-black text-gray-800 text-lg">{ab.plat_nomor_truk}</p>
            <p className="text-sm text-gray-600">{ab.supplier}</p>
            <p className="text-xs text-gray-400">{ab.jenis_armada} · PO: {ab.nomor_po}</p>

            {status === 'unloading' && ab.unloading_since && (
              <div className={`flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl ${isOverstay ? 'bg-red-100' : 'bg-amber-100'}`}>
                <Clock size={14} className={isOverstay ? 'text-red-500' : 'text-amber-600'} />
                <span className={`font-black tabular-nums text-sm ${isOverstay ? 'text-red-600' : 'text-amber-700'}`}>
                  {formatElapsed(unloadingMs)}
                </span>
                {isOverstay && <span className="text-red-500 text-xs font-semibold">(&gt; {OVERSTAY_THRESHOLD_MINUTES} mnt)</span>}
              </div>
            )}

            {/* Actions */}
            <div className="mt-3 space-y-2">
              {ab.status === 'arrived' && (
                <button
                  onClick={() => onStartUnloading(ab.id)}
                  disabled={actionLoading === ab.id}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
                >
                  {actionLoading === ab.id
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <PlayCircle size={16} />}
                  Mulai Bongkar
                </button>
              )}
              {ab.status === 'unloading' && (
                <button
                  onClick={() => onComplete({ id: ab.id, plat_nomor_truk: ab.plat_nomor_truk })}
                  disabled={actionLoading === ab.id}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
                >
                  {actionLoading === ab.id
                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <CheckCheck size={16} />}
                  Selesai Bongkar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Maintenance Toggle */}
        <button
          onClick={onToggleMaintenance}
          className="mt-3 w-full py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
        >
          <Wrench size={11} />
          {dock.status === 'maintenance' ? 'Buka Kembali' : 'Set Maintenance'}
        </button>
      </div>
    </div>
  );
}
