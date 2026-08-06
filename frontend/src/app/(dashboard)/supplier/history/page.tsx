'use client';

import { useState, useEffect } from 'react';
import { fetchMyBookings, Booking, formatDate, formatTime, statusColors } from '@/lib/booking';
import BookingTicketModal from '@/components/BookingTicketModal';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function SupplierHistoryPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // Fetch completed / cancelled or all past bookings
      const data = await fetchMyBookings();
      setBookings(data || []);
    } catch (err: any) {
      toast.error('Gagal memuat riwayat booking');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredBookings = bookings.filter((b) => {
    // Only history statuses or all completed/cancelled
    const isHistoryStatus = b.status === 'completed' || b.status === 'cancelled';
    if (!isHistoryStatus && statusFilter === 'all') {
      // Show completed and cancelled by default in history page
      return false;
    }
    if (statusFilter !== 'all' && b.status !== statusFilter) {
      return false;
    }

    const query = search.toLowerCase();
    const matchSearch =
      b.nomor_po.toLowerCase().includes(query) ||
      b.nama_sopir.toLowerCase().includes(query) ||
      b.plat_nomor_truk.toLowerCase().includes(query) ||
      b.loading_dock?.nama_dock?.toLowerCase().includes(query);

    const matchDateFrom = !dateFrom || new Date(b.tanggal_booking) >= new Date(dateFrom);
    const matchDateTo = !dateTo || new Date(b.tanggal_booking) <= new Date(dateTo);

    return matchSearch && matchDateFrom && matchDateTo;
  });

  // Calculate summary stats
  const totalCompleted = bookings.filter((b) => b.status === 'completed').length;
  const totalCancelled = bookings.filter((b) => b.status === 'cancelled').length;
  const totalRecords = bookings.length;

  return (
    <>
      {/* SCREEN UI VIEW (Hidden on Print) */}
      <div className="space-y-6 pb-12 print:hidden" data-tour="history-header">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-[#1B365D]">Riwayat Booking & Transaksi</h1>
            <p className="text-gray-500 text-sm mt-1">
              Arsip transaksi bongkar muat yang telah selesai atau dibatalkan.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-[#1B365D] hover:bg-[#2A4874] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Laporan</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-tour="stat-cards">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">task_alt</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Selesai Bongkar</p>
              <p className="text-2xl font-extrabold text-gray-800">{totalCompleted}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">cancel</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Dibatalkan</p>
              <p className="text-2xl font-extrabold text-gray-800">{totalCancelled}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1B365D]/10 text-[#1B365D] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">history</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Riwayat</p>
              <p className="text-2xl font-extrabold text-gray-800">{totalRecords}</p>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4" data-tour="history-filters">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Cari PO / Sopir / Plat:</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Ketik kata kunci..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
              >
                <option value="all">Semua Riwayat (Completed / Cancelled)</option>
                <option value="completed">Selesai (Completed)</option>
                <option value="cancelled">Dibatalkan (Cancelled)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Dari Tanggal:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Sampai Tanggal:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* History Data Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" data-tour="history-table">
          {loading ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-3xl text-[#1B365D]">progress_activity</span>
              <p className="text-sm">Memuat data riwayat...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">find_in_page</span>
              <p className="text-gray-600 font-medium">Tidak ada riwayat booking yang sesuai kriteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Nomor PO</th>
                    <th className="px-6 py-4">Tanggal & Slot</th>
                    <th className="px-6 py-4">Loading Dock</th>
                    <th className="px-6 py-4">Armada & Driver</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((b) => {
                    const conf = statusColors[b.status] || { bg: 'bg-gray-200', text: 'text-gray-800', label: b.status };

                    return (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#1B365D]">{b.nomor_po}</p>
                          <p className="text-xs text-gray-400">ID #{b.id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{formatDate(b.tanggal_booking)}</p>
                          <p className="text-xs text-gray-500">
                            {b.time_slot ? `${formatTime(b.time_slot.jam_mulai)} - ${formatTime(b.time_slot.jam_selesai)} WIB` : '-'}
                          </p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {b.loading_dock?.nama_dock || `Dock #${b.loading_dock_id}`}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{b.plat_nomor_truk}</p>
                          <p className="text-xs text-gray-500">{b.nama_sopir} ({b.jenis_armada})</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${conf.bg} ${conf.text}`}>
                            {conf.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedTicket(b)}
                            className="inline-flex items-center gap-1.5 bg-[#1B365D]/10 hover:bg-[#1B365D]/20 text-[#1B365D] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">qr_code</span>
                            <span>Lihat Tiket</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Ticket Modal */}
        {selectedTicket && (
          <BookingTicketModal
            booking={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </div>

      {/* PRINT-ONLY FORMAL CORPORATE REPORT TEMPLATE */}
      <div className="hidden print:block text-black p-2 space-y-5">
        {/* Kop Surat Corporate Header */}
        <div className="border-b-4 border-double border-slate-900 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              {user?.logo_url ? (
                <div className="h-12 w-auto max-w-[120px] flex items-center justify-center overflow-hidden shrink-0">
                  <img src={user.logo_url} alt="Logo Supplier" className="max-h-full max-w-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#1B365D] text-white flex items-center justify-center font-black text-xl tracking-wider shrink-0">
                  L
                </div>
              )}
              <div>
                <h1 className="text-xl font-black tracking-wider text-[#1B365D] uppercase">
                  {user?.nama_instansi || 'PT LOGISLOT INDONESIA LOGISTICS'}
                </h1>
                <p className="text-[11px] font-bold text-slate-700">
                  {user?.nama_instansi ? 'Laporan Transaksi Resmi Mitra Supplier / Vendor Logistik' : 'Sistem Manajemen Operasional Bongkar Muat & Loading Dock Warehouse'}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-600 mt-1">
              Kawasan Industri Logistik Nusantara | Platform Manajemen Slot LOGISLOT
            </p>
          </div>
          <div className="text-right text-[10px] leading-tight border-l border-slate-300 pl-4 shrink-0">
            <p className="font-extrabold text-slate-900 uppercase">DOKUMEN VENDOR RESMI</p>
            <p className="text-slate-600">No. Ref: REPO/SUP/2026/08/{Math.floor(1000 + Math.random() * 9000)}</p>
            <p className="text-slate-600">Tgl Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-slate-600">Waktu: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center space-y-1">
          <h2 className="text-base font-black uppercase text-slate-900 tracking-wide">
            LAPORAN RIWAYAT TRANSAKSI & BONGKAR MUAT SUPPLIER
          </h2>
          <p className="text-[11px] text-slate-600 font-semibold">
            Arsip Ringkasan Transaksi Aktivitas Bongkar Muat Armada Truk
          </p>
        </div>

        {/* Metadata Information Grid */}
        <div className="grid grid-cols-2 gap-4 border border-slate-400 rounded-md p-3 bg-slate-50 text-xs">
          <div className="space-y-1">
            <p><span className="font-semibold text-slate-600">Nama Supplier / PT:</span> <strong className="text-slate-900">{user?.nama_instansi || user?.nama || 'PT Supplier Logistics Partner'}</strong></p>
            <p><span className="font-semibold text-slate-600">Kontak Email:</span> <span className="text-slate-900">{user?.email || 'supplier@logisslot.com'}</span></p>
            <p><span className="font-semibold text-slate-600">Peroperator Sistem:</span> <span className="text-slate-900">{user?.nama || 'Petugas Vendor'} ({user?.role?.toUpperCase()})</span></p>
          </div>
          <div className="space-y-1 text-right">
            <p><span className="font-semibold text-slate-600">Filter Status:</span> <strong className="text-slate-900">{statusFilter === 'all' ? 'Semua Status (Selesai & Dibatalkan)' : statusFilter === 'completed' ? 'Selesai (Completed)' : 'Dibatalkan (Cancelled)'}</strong></p>
            <p><span className="font-semibold text-slate-600">Periode Data:</span> <span className="text-slate-900">{dateFrom || dateTo ? `${dateFrom || 'Awal'} s/d ${dateTo || 'Hari ini'}` : 'Semua Riwayat Terdaftar'}</span></p>
            <p><span className="font-semibold text-slate-600">Ringkasan Total:</span> <strong className="text-slate-900">{totalCompleted} Selesai | {totalCancelled} Dibatalkan | {filteredBookings.length} Records</strong></p>
          </div>
        </div>

        {/* Formal Data Table */}
        <div className="space-y-2">
          <table className="w-full text-left text-xs border border-slate-400 border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold uppercase text-[10px] tracking-wider border-b border-slate-400">
                <th className="border border-slate-400 px-2 py-2 text-center w-8">No</th>
                <th className="border border-slate-400 px-3 py-2">Nomor PO</th>
                <th className="border border-slate-400 px-3 py-2">Tanggal & Slot Waktu</th>
                <th className="border border-slate-400 px-3 py-2">Loading Dock</th>
                <th className="border border-slate-400 px-3 py-2">Armada & Sopir</th>
                <th className="border border-slate-400 px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-slate-400 text-center py-6 text-slate-500 italic">
                    Tidak ada data riwayat transaksi.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b, idx) => (
                  <tr key={b.id} className="odd:bg-white even:bg-slate-50">
                    <td className="border border-slate-300 px-2 py-2 text-center font-medium text-slate-700">{idx + 1}</td>
                    <td className="border border-slate-300 px-3 py-2">
                      <p className="font-bold text-slate-900">{b.nomor_po}</p>
                      <p className="text-[9px] text-slate-500">ID #{b.id}</p>
                    </td>
                    <td className="border border-slate-300 px-3 py-2">
                      <p className="font-medium text-slate-800">{formatDate(b.tanggal_booking)}</p>
                      <p className="text-[10px] text-slate-600">
                        {b.time_slot ? `${formatTime(b.time_slot.jam_mulai)} - ${formatTime(b.time_slot.jam_selesai)} WIB` : '-'}
                      </p>
                    </td>
                    <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-800">
                      {b.loading_dock?.nama_dock || `Dock #${b.loading_dock_id}`}
                    </td>
                    <td className="border border-slate-300 px-3 py-2">
                      <p className="font-bold text-slate-900">{b.plat_nomor_truk}</p>
                      <p className="text-[10px] text-slate-600">{b.nama_sopir} ({b.jenis_armada})</p>
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-bold">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase border ${
                        b.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}>
                        {b.status === 'completed' ? 'SELESAI BONGKAR' : 'DIBATALKAN'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Formal Signature & Approval Section */}
        <div className="pt-6 page-break-inside-avoid">
          <div className="grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <p className="font-semibold text-slate-700">Dibuat Oleh (Supplier):</p>
              <div className="h-16 flex items-end justify-center">
                <span className="text-[9px] text-slate-400 italic">[ Tanda Tangan Digital ]</span>
              </div>
              <p className="font-bold text-slate-900 underline">{user?.nama || 'Petugas Vendor'}</p>
              <p className="text-[10px] text-slate-600">{user?.nama_instansi || 'Perwakilan PT Supplier'}</p>
            </div>

            <div>
              <p className="font-semibold text-slate-700">Diperiksa Oleh (Gate Control):</p>
              <div className="h-16 flex items-end justify-center">
                <span className="text-[9px] text-slate-400 italic">[ Stempel / Verification ]</span>
              </div>
              <p className="font-bold text-slate-900 underline">( .................................... )</p>
              <p className="text-[10px] text-slate-600">Inspection & Security IC</p>
            </div>

            <div>
              <p className="font-semibold text-slate-700">Disetujui Oleh (Warehouse):</p>
              <div className="h-16 flex items-end justify-center">
                <span className="text-[9px] text-slate-400 italic">[ Legalization Approval ]</span>
              </div>
              <p className="font-bold text-slate-900 underline">( .................................... )</p>
              <p className="text-[10px] text-slate-600">Manager Operasional Logistik</p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Page Numbering */}
        <div className="border-t border-slate-300 pt-2 mt-4 text-[9px] text-slate-500 flex justify-between items-center">
          <p>Catatan: Laporan ini dikeluarkan secara sah dari Platform Sistem LOGISLOT dan berfungsi sebagai arsip resmi pertanggungjawaban bongkar muat.</p>
          <p className="font-bold">LOGISLOT LOGISTICS - DOC PAGE 1/1</p>
        </div>
      </div>
    </>
  );
}

