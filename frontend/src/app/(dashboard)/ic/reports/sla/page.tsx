'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../../../../components/ProtectedRoute';
import { useAuth } from '../../../../../context/AuthContext';
import { fetchSlaReport, SlaReport, SlaSummary, SlaDetail, formatDate } from '../../../../../lib/ic';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { BarChart2, Clock, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function SLAReportPage() {
  return (
    <ProtectedRoute allowedRoles={['ic', 'admin']}>
      <SLAReport />
    </ProtectedRoute>
  );
}

function SLAReport() {
  const { user, logout } = useAuth();
  const [report, setReport] = useState<SlaReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSlaReport({ date_from: dateFrom, date_to: dateTo });
      setReport(data);
    } catch (e) {
      console.error('Failed to load SLA report', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const chartData = report?.summary.map(s => ({
    name: s.instansi.length > 14 ? s.instansi.slice(0, 14) + '…' : s.instansi,
    fullName: s.instansi,
    supplier: s.supplier_nama,
    'Tepat Waktu': s.tepat_waktu,
    'Terlambat': s.terlambat,
    'Lebih Awal': s.lebih_awal,
    pct: s.pct_tepat_waktu,
  })) || [];

  const totalAnalyzed = report?.meta.total_bookings_analyzed || 0;
  const totalOnTime = report?.summary.reduce((a, s) => a + s.tepat_waktu, 0) || 0;
  const totalLate = report?.summary.reduce((a, s) => a + s.terlambat, 0) || 0;
  const overallPct = totalAnalyzed > 0 ? Math.round((totalOnTime / totalAnalyzed) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Navbar */}
      <nav className="bg-[#1B365D] text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <BarChart2 size={22} className="text-blue-300" />
          <span className="text-lg font-black tracking-tight">LOGISLOT</span>
          <span className="ml-2 px-2 py-0.5 bg-blue-800/60 rounded text-xs font-medium">
            Laporan SLA
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/ic/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
          >
            ← Dashboard
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-[#1B365D] mb-4 flex items-center gap-2">
            <BarChart2 size={18} />
            Laporan Analisis SLA Ketepatan Waktu Supplier
          </h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Dari Tanggal</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B365D] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Hingga Tanggal</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1B365D] outline-none" />
            </div>
            <button onClick={load}
              className="flex items-center gap-2 px-5 py-2 bg-[#1B365D] text-white text-sm rounded-lg hover:bg-[#1B365D]/90 transition font-medium"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Muat Laporan
            </button>
          </div>
        </div>

        {/* Overall KPI Cards */}
        {report && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Total Dianalisis" value={totalAnalyzed} icon={<BarChart2 size={20} />} color="bg-[#1B365D]" />
            <KpiCard
              label="Tepat Waktu"
              value={`${overallPct}%`}
              sub={`${totalOnTime} pengiriman`}
              icon={<TrendingUp size={20} />}
              color={overallPct >= 80 ? 'bg-emerald-500' : overallPct >= 50 ? 'bg-amber-500' : 'bg-red-500'}
            />
            <KpiCard
              label="Terlambat"
              value={totalLate}
              icon={<TrendingDown size={20} />}
              color="bg-red-500"
            />
            <KpiCard
              label="Supplier Dianalisis"
              value={report.summary.length}
              icon={<AlertTriangle size={20} />}
              color="bg-blue-500"
            />
          </div>
        )}

        {/* Bar Chart */}
        {!loading && chartData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-semibold text-[#1B365D] mb-4 text-sm">
              Performa Ketepatan Waktu per Supplier
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  formatter={(value, name) => [`${value} booking`, name]}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Tepat Waktu" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Terlambat" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Lebih Awal" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary Table */}
        {!loading && report && report.summary.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-[#1B365D] text-sm">Ringkasan Per Supplier</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Supplier', 'Instansi', 'Total', 'Tepat Waktu', 'Terlambat', 'Lebih Awal', 'Rata-rata Selisih', '% Tepat'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.summary.map(s => (
                    <tr key={s.supplier_id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{s.supplier_nama}</td>
                      <td className="px-4 py-3 text-gray-600">{s.instansi}</td>
                      <td className="px-4 py-3 text-gray-700 font-semibold">{s.total}</td>
                      <td className="px-4 py-3">
                        <span className="text-emerald-600 font-semibold">{s.tepat_waktu}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={s.terlambat > 0 ? 'text-red-500 font-semibold' : 'text-gray-400'}>
                          {s.terlambat}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={s.lebih_awal > 0 ? 'text-amber-500 font-semibold' : 'text-gray-400'}>
                          {s.lebih_awal}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {s.rata_rata_selisih_menit !== null
                          ? `${s.rata_rata_selisih_menit > 0 ? '+' : ''}${s.rata_rata_selisih_menit} mnt`
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-16">
                            <div
                              className={`h-full rounded-full ${s.pct_tepat_waktu >= 80 ? 'bg-emerald-500' : s.pct_tepat_waktu >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
                              style={{ width: `${s.pct_tepat_waktu}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${s.pct_tepat_waktu >= 80 ? 'text-emerald-600' : s.pct_tepat_waktu >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                            {s.pct_tepat_waktu}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty / Loading state */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#1B365D] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && report && report.summary.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-400">
            <BarChart2 size={40} className="mx-auto mb-2 opacity-30" />
            <p>Tidak ada data dalam rentang tanggal tersebut</p>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  label, value, sub, icon, color
}: {
  label: string; value: string | number; sub?: string; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
      <div className={`${color} p-2.5 rounded-xl text-white shrink-0`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}
