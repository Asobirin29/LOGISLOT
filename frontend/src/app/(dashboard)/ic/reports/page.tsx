'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchSlaReport, SlaReport } from '@/lib/ic';
import toast from 'react-hot-toast';

export default function IcReportsSlaPage() {
  const [report, setReport] = useState<SlaReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSlaReport({ date_from: dateFrom, date_to: dateTo });
      setReport(data);
    } catch (err: any) {
      toast.error('Gagal memuat laporan SLA supplier');
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  // Aggregate global stats
  const summaries = report?.summary || [];
  const totalAnalyzed = report?.meta?.total_bookings_analyzed || 0;
  const totalOnTime = summaries.reduce((acc, curr) => acc + curr.tepat_waktu, 0);
  const totalLate = summaries.reduce((acc, curr) => acc + curr.terlambat, 0);
  const totalEarly = summaries.reduce((acc, curr) => acc + curr.lebih_awal, 0);
  const overallPctOnTime = totalAnalyzed > 0 ? Math.round((totalOnTime / totalAnalyzed) * 100) : 0;

  return (
    <div className="space-y-6 pb-12" data-tour="ic-report-header">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#1B365D]">Laporan SLA & Kinerja Kedatangan Supplier</h1>
          <p className="text-gray-500 text-sm mt-1">
            Analisis tingkat kepatuhan ketepatan waktu kedatangan armada supplier terhadap time slot terencana.
          </p>
        </div>
        <div className="flex items-center gap-3" data-tour="ic-report-export">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-[#1B365D] hover:bg-[#2A4874] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Ekspor Laporan SLA</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Dari Tanggal:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Sampai Tanggal:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
            />
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          Toleransi Keterlambatan: <strong>±{report?.meta?.tolerance_minutes || 15} Menit</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1B365D]/10 text-[#1B365D] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">analytics</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Analisis</p>
            <p className="text-2xl font-extrabold text-gray-800">{totalAnalyzed} <span className="text-xs font-normal text-gray-500">Booking</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">SLA Tepat Waktu</p>
            <p className="text-2xl font-extrabold text-emerald-600">{overallPctOnTime}%</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Keterlambatan</p>
            <p className="text-2xl font-extrabold text-red-600">{totalLate} <span className="text-xs font-normal text-gray-500">Armada</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Lebih Awal</p>
            <p className="text-2xl font-extrabold text-blue-600">{totalEarly} <span className="text-xs font-normal text-gray-500">Armada</span></p>
          </div>
        </div>
      </div>

      {/* Summary Table by Supplier */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4 p-6">
        <h2 className="text-lg font-bold text-[#1B365D] flex items-center gap-2">
          <span className="material-symbols-outlined">leaderboard</span>
          Ringkasan Performa Per Supplier
        </h2>

        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-3xl text-[#1B365D]">progress_activity</span>
            <p className="text-sm">Memuat ringkasan SLA supplier...</p>
          </div>
        ) : summaries.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-2">assessment</span>
            <p className="text-gray-600 font-medium">Belum ada data kedatangan untuk dianalisis.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Nama Supplier / Instansi</th>
                  <th className="px-6 py-4 text-center">Tepat Waktu</th>
                  <th className="px-6 py-4 text-center">Terlambat</th>
                  <th className="px-6 py-4 text-center">Lebih Awal</th>
                  <th className="px-6 py-4 text-center">Total Kedatangan</th>
                  <th className="px-6 py-4 text-right">Skor SLA %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {summaries.map((s) => (
                  <tr key={s.supplier_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1B365D]">{s.supplier_nama}</p>
                      <p className="text-xs text-gray-500">{s.instansi || 'Supplier Corporate'}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-emerald-600">{s.tepat_waktu}</td>
                    <td className="px-6 py-4 text-center font-semibold text-red-600">{s.terlambat}</td>
                    <td className="px-6 py-4 text-center font-semibold text-blue-600">{s.lebih_awal}</td>
                    <td className="px-6 py-4 text-center font-bold">{s.total}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        s.pct_tepat_waktu >= 85
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.pct_tepat_waktu >= 70
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {s.pct_tepat_waktu}% SLA
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Log Table */}
      {report?.details && report.details.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4 p-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1B365D]">list_alt</span>
            Rincian Log Kedatangan Armada
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">PO Number</th>
                  <th className="px-6 py-3">Supplier</th>
                  <th className="px-6 py-3">Jadwal Slot</th>
                  <th className="px-6 py-3">Waktu Tiba Gerbang</th>
                  <th className="px-6 py-3 text-center">Selisih</th>
                  <th className="px-6 py-3 text-right">Kategori SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {report.details.map((d) => (
                  <tr key={d.booking_id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-bold text-[#1B365D]">{d.nomor_po}</td>
                    <td className="px-6 py-3">{d.supplier}</td>
                    <td className="px-6 py-3">{d.jadwal_slot}</td>
                    <td className="px-6 py-3 font-semibold">{d.waktu_tiba || '-'}</td>
                    <td className="px-6 py-3 text-center font-bold">
                      {d.selisih_menit != null ? `${d.selisih_menit > 0 ? '+' : ''}${d.selisih_menit} mnt` : '-'}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        d.kategori === 'tepat_waktu'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.kategori === 'terlambat'
                          ? 'bg-red-100 text-red-800'
                          : d.kategori === 'lebih_awal'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {d.kategori.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
