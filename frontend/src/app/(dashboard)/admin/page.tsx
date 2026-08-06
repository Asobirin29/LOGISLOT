'use client';

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="space-y-6 pb-12" data-tour="admin-stat-overview">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1B365D] to-[#2E5B82] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Portal Administrator LOGISLOT</h1>
          <p className="text-gray-200 text-sm mt-1">
            Pusat kendali pengaturan time slot, manajemen loading dock, hak akses pengguna, dan audit log sistem.
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-tour="admin-quick-nav">
        <Link
          href="/admin/slots"
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1B365D]/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl">date_range</span>
          </div>
          <h3 className="font-bold text-gray-800 group-hover:text-[#1B365D]">Time Slot & Kuota</h3>
          <p className="text-xs text-gray-500 mt-1">Atur jam slot operasional dan kuota maksimal truk.</p>
        </Link>

        <Link
          href="/admin/docks"
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1B365D]/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <h3 className="font-bold text-gray-800 group-hover:text-[#1B365D]">Manajemen Loading Dock</h3>
          <p className="text-xs text-gray-500 mt-1">Kelola area bay loading dock gudang.</p>
        </Link>

        <Link
          href="/admin/users"
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1B365D]/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
          <h3 className="font-bold text-gray-800 group-hover:text-[#1B365D]">Manajemen User</h3>
          <p className="text-xs text-gray-500 mt-1">Kelola akun dan peran pengguna (Supplier, Gate, WH, IC, Admin).</p>
        </Link>

        <Link
          href="/admin/audit"
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1B365D]/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl">manage_history</span>
          </div>
          <h3 className="font-bold text-gray-800 group-hover:text-[#1B365D]">Audit Log Sistem</h3>
          <p className="text-xs text-gray-500 mt-1">Pantau rekam jejak aktivitas dan riwayat aksi sistem.</p>
        </Link>
      </div>

      {/* System Status Overview */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4" data-tour="admin-status-grid">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1B365D]">verified_user</span>
          Ringkasan Status Operasional Sistem
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-semibold">Database Services</p>
              <p className="font-bold text-emerald-600 mt-0.5">Online & Connected</p>
            </div>
            <span className="material-symbols-outlined text-emerald-500 text-2xl">check_circle</span>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-semibold">Realtime Socket & Gateway</p>
              <p className="font-bold text-emerald-600 mt-0.5">Operational</p>
            </div>
            <span className="material-symbols-outlined text-emerald-500 text-2xl">sensors</span>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 flex items-center justify-between">
            <div>
              <p className="text-gray-500 font-semibold">Modul Autentikasi JWT</p>
              <p className="font-bold text-emerald-600 mt-0.5">Active</p>
            </div>
            <span className="material-symbols-outlined text-emerald-500 text-2xl">shield</span>
          </div>
        </div>
      </div>
    </div>
  );
}
