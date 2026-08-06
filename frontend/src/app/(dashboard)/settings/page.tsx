'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    nama_instansi: user?.nama_instansi || '',
    nomor_telepon: user?.nomor_telepon || '0812-3456-7890',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailBooking: true,
    emailSlaAlert: true,
    browserNotification: true,
    whatsappAlert: false,
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      toast.success('Pengaturan profil berhasil diperbarui!');
    }, 600);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      toast.error('Kata sandi lama wajib diisi.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Kata sandi berhasil diubah!');
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12" data-tour="settings-profile">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#1B365D]">Pengaturan Akun & Sistem</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola preferensi akun, kata sandi keamanan, dan notifikasi aplikasi LogisSlot Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1B365D]">person</span>
              Informasi Profil Saya
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={profile.nama}
                    onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat Email *</label>
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Perusahaan / Instansi</label>
                  <input
                    type="text"
                    value={profile.nama_instansi}
                    onChange={(e) => setProfile({ ...profile, nama_instansi: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor Telepon / WA</label>
                  <input
                    type="text"
                    value={profile.nomor_telepon}
                    onChange={(e) => setProfile({ ...profile, nomor_telepon: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-[#1B365D] hover:bg-[#2A4874] disabled:bg-gray-300 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-colors flex items-center gap-2"
                >
                  {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1B365D]">lock</span>
              Ganti Kata Sandi
            </h2>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kata Sandi Saat Ini *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Kata Sandi Baru *</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Konfirmasi Kata Sandi Baru *</label>
                  <input
                    type="password"
                    required
                    placeholder="Ulangi kata sandi baru"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="bg-[#1B365D] hover:bg-[#2A4874] disabled:bg-gray-300 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
                >
                  {savingPassword ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notifications & App Preferences */}
        <div className="space-y-6" data-tour="settings-pref">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1B365D]">notifications</span>
              Preferensi Notifikasi
            </h2>

            <div className="space-y-4 text-xs font-medium text-gray-700">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span>Notifikasi Email Konfirmasi Booking</span>
                <input
                  type="checkbox"
                  checked={notifications.emailBooking}
                  onChange={(e) => setNotifications({ ...notifications, emailBooking: e.target.checked })}
                  className="w-4 h-4 text-[#1B365D] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span>Peringatan Email Keterlambatan / SLA</span>
                <input
                  type="checkbox"
                  checked={notifications.emailSlaAlert}
                  onChange={(e) => setNotifications({ ...notifications, emailSlaAlert: e.target.checked })}
                  className="w-4 h-4 text-[#1B365D] rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <span>Notifikasi Pop-up Browser (Realtime)</span>
                <input
                  type="checkbox"
                  checked={notifications.browserNotification}
                  onChange={(e) => setNotifications({ ...notifications, browserNotification: e.target.checked })}
                  className="w-4 h-4 text-[#1B365D] rounded"
                />
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1B365D]">info</span>
              Informasi Peran & Portal
            </h2>

            <div className="text-xs space-y-2 text-gray-600">
              <p><span className="font-semibold text-gray-800">Role Terdaftar:</span> <strong className="uppercase text-[#1B365D]">{user?.role}</strong></p>
              <p><span className="font-semibold text-gray-800">Versi Aplikasi:</span> LogisSlot v2.4.0-Enterprise</p>
              <p><span className="font-semibold text-gray-800">Zona Waktu:</span> Asia/Jakarta (WIB GMT+7)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
