'use client';

import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { useAuth } from '../../../../context/AuthContext';
import {
  fetchICBookings,
  updatePriority,
  ICBooking,
  PriorityLevel,
  formatDate,
  formatTime,
  getSlotDeadlineStatus,
} from '../../../../lib/ic';
import { statusColors } from '../../../../lib/booking';
import { useRealtimeBookings } from '../../../../lib/useRealtimeBookings';
import {
  LayoutDashboard, Filter, RefreshCw, AlertTriangle,
  Zap, Clock, Package, Truck, LogOut, BarChart2, Search,
} from 'lucide-react';
import Link from 'next/link';

export default function ICDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['ic', 'admin']}>
      <ICDashboard />
    </ProtectedRoute>
  );
}

function ICDashboard() {
  const { user, logout } = useAuth();
  const [initialBookings, setInitialBookings] = useState<ICBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPO, setFilterPO] = useState('');
  const [searchPO, setSearchPO] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchICBookings({
        tanggal: filterDate || undefined,
        status: filterStatus || undefined,
        nomor_po: searchPO || undefined,
      });
      setInitialBookings(data);
    } catch (e) {
      console.error('Failed to load bookings', e);
    } finally {
      setLoading(false);
    }
  }, [filterDate, filterStatus, searchPO]);

  const { bookings, setBookings } = useRealtimeBookings<ICBooking>(initialBookings, load);

  useEffect(() => {
    load();
  }, [load]);

  const handleTogglePriority = async (booking: ICBooking) => {
    setUpdatingId(booking.id);
    const newPriority: PriorityLevel = booking.priority_level === 'urgent' ? 'normal' : 'urgent';
    try {
      const updated = await updatePriority(booking.id, newPriority);
      setBookings(prev => prev.map(b => b.id === updated.id ? { ...b, ...updated } : b));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah prioritas');
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: bookings.length,
    booked: bookings.filter(b => b.status === 'booked').length,
    arrived: bookings.filter(b => b.status === 'arrived').length,
    urgent: bookings.filter(b => b.priority_level === 'urgent').length,
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Navbar */}
      <nav className="bg-[#1B365D] text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={22} className="text-blue-300" />
          <span className="text-lg font-black tracking-tight">LOGISLOT</span>
          <span className="ml-2 px-2 py-0.5 bg-blue-800/60 rounded text-xs font-medium">
            Inventory Control
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/ic/reports/sla"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
          >
            <BarChart2 size={14} />
            Laporan SLA
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Hari Ini" value={stats.total} icon={<Package size={20} />} color="bg-[#1B365D]" />
          <StatCard label="Terjadwal" value={stats.booked} icon={<Clock size={20} />} color="bg-blue-500" />
          <StatCard label="Sudah Tiba" value={stats.arrived} icon={<Truck size={20} />} color="bg-emerald-500" />
          <StatCard label="Prioritas Urgent" value={stats.urgent} icon={<Zap size={20} />} color="bg-red-500" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal</label>
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B365D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B365D] outline-none"
              >
                <option value="">Semua Status</option>
                {['booked','arrived','unloading','completed','cancelled'].map(s => (
                  <option key={s} value={s}>{statusColors[s as keyof typeof statusColors]?.label || s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Cari No. PO</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchPO}
                  onChange={e => setSearchPO(e.target.value)}
                  placeholder="PO-2024-..."
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B365D] outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={load}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B365D] text-white text-sm rounded-lg hover:bg-[#1B365D]/90 transition font-medium"
              >
                <Filter size={14} />
                Filter
              </button>
              <button
                onClick={() => { setFilterDate(''); setFilterStatus(''); setSearchPO(''); }}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <button onClick={load} title="Refresh" className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                <RefreshCw size={15} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1B365D]/5 border-b border-gray-100">
                  {['#', 'No. PO', 'Supplier', 'Plat Nomor', 'Dock', 'Jadwal Slot', 'Status', 'Prioritas', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-[#1B365D] text-xs uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400">
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-[#1B365D] border-t-transparent rounded-full animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-400">
                      Tidak ada data booking
                    </td>
                  </tr>
                ) : (
                  bookings.map(booking => {
                    const deadline = getSlotDeadlineStatus(booking.tanggal_booking, booking.time_slot.jam_mulai);
                    const rowBg =
                      booking.priority_level === 'urgent'
                        ? 'bg-red-50'
                        : deadline === 'urgent'
                        ? 'bg-red-50/50'
                        : deadline === 'warning'
                        ? 'bg-amber-50/60'
                        : '';

                    const badge = statusColors[booking.status as keyof typeof statusColors];
                    const isActive = ['booked','arrived'].includes(booking.status);

                    return (
                      <tr
                        key={booking.id}
                        className={`border-b border-gray-50 hover:bg-gray-50 transition ${rowBg}`}
                      >
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{booking.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{booking.nomor_po}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800 leading-tight">{booking.user?.nama}</p>
                          <p className="text-xs text-gray-400">{booking.user?.nama_instansi}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">
                          {booking.plat_nomor_truk}
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {booking.loading_dock?.nama_dock}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="font-medium text-gray-800 text-xs">
                            {formatDate(booking.tanggal_booking)}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} />
                            {formatTime(booking.time_slot?.jam_mulai)}–{formatTime(booking.time_slot?.jam_selesai)}
                          </p>
                          {deadline !== 'normal' && (
                            <span className={`mt-0.5 inline-flex items-center gap-1 text-xs font-medium ${deadline === 'urgent' ? 'text-red-500' : 'text-amber-600'}`}>
                              <AlertTriangle size={10} />
                              {deadline === 'urgent' ? 'Lewat jadwal' : '< 1 jam lagi'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {badge && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {booking.priority_level === 'urgent' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                              <Zap size={10} />
                              Urgent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Normal
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isActive && (
                            <button
                              onClick={() => handleTogglePriority(booking)}
                              disabled={updatingId === booking.id}
                              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                                booking.priority_level === 'urgent'
                                  ? 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                  : 'bg-red-500 text-white hover:bg-red-600'
                              }`}
                            >
                              {updatingId === booking.id ? (
                                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
                              ) : booking.priority_level === 'urgent' ? (
                                'Set Normal'
                              ) : (
                                '⚡ Tandai Urgent'
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {!loading && bookings.length > 0 && (
            <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-50 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Updates Aktif · {bookings.length} booking ditemukan
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
            Melewati/mendekati jadwal atau prioritas Urgent
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-100 border border-amber-200" />
            Kurang dari 1 jam menuju slot
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, icon, color
}: {
  label: string; value: number; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
      <div className={`${color} p-2.5 rounded-xl text-white shrink-0`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
