'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchSlaReport, SlaReport } from '@/lib/ic';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function IcReportsSlaPage() {
  const { user } = useAuth();
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
    <>
      {/* WEB SCREEN VIEW (Hidden on print) */}
      <div className="space-y-6 pb-12 print:hidden" data-tour="ic-report-header">
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

      {/* PRINT-ONLY FORMAL SLA REPORT TEMPLATE */}
      <div className="hidden print:block text-black p-2 space-y-5">
        {/* Kop Surat Corporate Header */}
        <div className="border-b-4 border-double border-slate-900 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1B365D] text-white flex items-center justify-center font-black text-xl tracking-wider">
                L
              </div>
              <div>
                <h1 className="text-xl font-black tracking-wider text-[#1B365D] uppercase">PT LOGISLOT INDONESIA LOGISTICS</h1>
                <p className="text-[11px] font-bold text-slate-700">Audit Internal & Laporan Kinerja Kepatuhan SLA Kedatangan Supplier</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 mt-1">
              Gedung Management Logistics Lt. 5, Jl. Cargo Raya No. 88, Jakarta | Call Center: (021) 555-0199 | ic-audit@logisslot.co.id
            </p>
          </div>
          <div className="text-right text-[10px] leading-tight border-l border-slate-300 pl-4">
            <p className="font-extrabold text-slate-900 uppercase">AUDIT SLA REPORT</p>
            <p className="text-slate-600">No: SLA/IC/{new Date().getFullYear()}/{String(new Date().getMonth() + 1).padStart(2, '0')}/{Math.floor(1000 + Math.random() * 9000)}</p>
            <p className="text-slate-600">Dicetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-slate-600">Auditor: {user?.nama || 'Inventory Control'}</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-base font-black uppercase text-slate-900 tracking-wide">
            LAPORAN KINERJA KETEPATAN WAKTU (SLA) SUPPLIER
          </h2>
          <p className="text-[11px] text-slate-600 font-semibold">
            Hasil Analisis Toleransi Waktu Tiba Armada Truk di Gate Warehouse
          </p>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-4 gap-3 border border-slate-400 rounded-md p-3 bg-slate-50 text-xs text-center">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Total Analisis</p>
            <p className="text-base font-black text-slate-900">{totalAnalyzed} Booking</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Skor Tepat Waktu</p>
            <p className="text-base font-black text-emerald-700">{overallPctOnTime}% SLA</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Terlambat</p>
            <p className="text-base font-black text-red-700">{totalLate} Armada</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Toleransi SLA</p>
            <p className="text-base font-black text-blue-800">±{report?.meta?.tolerance_minutes || 15} Menit</p>
          </div>
        </div>

        {/* Supplier Performance Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase">1. Rekapitulasi Performa Per Supplier</h3>
          <table className="w-full text-left text-xs border border-slate-400 border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-400">
                <th className="border border-slate-400 px-2 py-1.5 text-center w-8">No</th>
                <th className="border border-slate-400 px-3 py-1.5">Nama Supplier / Instansi</th>
                <th className="border border-slate-400 px-3 py-1.5 text-center">Tepat Waktu</th>
                <th className="border border-slate-400 px-3 py-1.5 text-center">Terlambat</th>
                <th className="border border-slate-400 px-3 py-1.5 text-center">Lebih Awal</th>
                <th className="border border-slate-400 px-3 py-1.5 text-center">Total Kedatangan</th>
                <th className="border border-slate-400 px-3 py-1.5 text-right">Persentase SLA</th>
              </tr>
            </thead>
            <tbody>
              {summaries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border border-slate-400 text-center py-4 text-slate-500 italic">
                    Belum ada data analisis SLA.
                  </td>
                </tr>
              ) : (
                summaries.map((s, idx) => (
                  <tr key={s.supplier_id} className="odd:bg-white even:bg-slate-50">
                    <td className="border border-slate-300 px-2 py-1.5 text-center font-medium text-slate-700">{idx + 1}</td>
                    <td className="border border-slate-300 px-3 py-1.5">
                      <p className="font-bold text-slate-900">{s.supplier_nama}</p>
                      <p className="text-[9px] text-slate-500">{s.instansi || 'Supplier Corporate'}</p>
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-emerald-700">{s.tepat_waktu}</td>
                    <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-red-700">{s.terlambat}</td>
                    <td className="border border-slate-300 px-3 py-1.5 text-center font-bold text-blue-700">{s.lebih_awal}</td>
                    <td className="border border-slate-300 px-3 py-1.5 text-center font-extrabold">{s.total}</td>
                    <td className="border border-slate-300 px-3 py-1.5 text-right font-black">
                      {s.pct_tepat_waktu}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Approval Footer */}
        <div className="pt-6 page-break-inside-avoid">
          <div className="grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="font-semibold text-slate-700">Dibuat Oleh (Inventory Control Officer):</p>
              <div className="h-14 flex items-end justify-center">
                <span className="text-[9px] text-slate-400 italic">[ Verified Digital Signature ]</span>
              </div>
              <p className="font-bold text-slate-900 underline">{user?.nama || 'Auditor IC'}</p>
              <p className="text-[10px] text-slate-600">Tim Evaluasi Kinerja Logistik</p>
            </div>

            <div>
              <p className="font-semibold text-slate-700">Mengetahui (Head of Supply Chain):</p>
              <div className="h-14 flex items-end justify-center">
                <span className="text-[9px] text-slate-400 italic">[ Legalization Stamp ]</span>
              </div>
              <p className="font-bold text-slate-900 underline">( .................................... )</p>
              <p className="text-[10px] text-slate-600">VP Operations & Logistics</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-2 mt-4 text-[9px] text-slate-500 flex justify-between items-center">
          <p>Laporan SLA ini dihasilkan secara otomatis dari data IoT Sensor & Gate Scan LOGISLOT.</p>
          <p className="font-bold">PAGE 1/1</p>
        </div>
      </div>
    </>
  );
}

