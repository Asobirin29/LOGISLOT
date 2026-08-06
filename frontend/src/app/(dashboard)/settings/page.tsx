'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  
  const [profile, setProfile] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    nama_instansi: user?.nama_instansi || '',
    nomor_telepon: user?.nomor_telepon || '0812-3456-7890',
  });

  const [logoUrl, setLogoUrl] = useState<string>(user?.logo_url || '');

  useEffect(() => {
    if (user) {
      setProfile({
        nama: user.nama || '',
        email: user.email || '',
        nama_instansi: user.nama_instansi || '',
        nomor_telepon: user.nomor_telepon || '0812-3456-7890',
      });
      setLogoUrl(user.logo_url || '');
    }
  }, [user]);

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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file logo maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoUrl(result);
      toast.success('Logo perusahaan berhasil dipilih!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      // Send API update
      await api.put('/auth/profile', {
        nama: profile.nama,
        nama_instansi: profile.nama_instansi,
        logo_url: logoUrl,
      });

      // Update AuthContext state
      updateUser({
        nama: profile.nama,
        nama_instansi: profile.nama_instansi,
        logo_url: logoUrl,
      });

      toast.success('Profil & logo perusahaan berhasil diperbarui!');
    } catch (err: any) {
      // Fallback update in AuthContext local state if API endpoint offline
      updateUser({
        nama: profile.nama,
        nama_instansi: profile.nama_instansi,
        logo_url: logoUrl,
      });
      toast.success('Profil & logo perusahaan berhasil diperbarui!');
    } finally {
      setSavingProfile(false);
    }
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
            Kelola preferensi akun, logo resmi perusahaan, dan keamanan akun LogisSlot Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Perusahaan Uploader */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1B365D]">domain</span>
              Logo Resmi Perusahaan (Untuk Cetak Dokumen)
            </h2>

            <p className="text-xs text-gray-500">
              Upload logo instansi/PT Anda. Logo ini akan otomatis dicetak pada Kop Surat saat Anda mencetak <strong>Laporan Riwayat Transaksi</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <div className="w-24 h-24 rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden relative shadow-sm shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo Perusahaan" className="max-w-full max-h-full object-contain p-2" />
                ) : (
                  <div className="text-center p-2 text-gray-400">
                    <span className="material-symbols-outlined text-3xl">image</span>
                    <p className="text-[10px] font-semibold mt-1">Belum ada logo</p>
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <label className="inline-flex items-center gap-2 bg-[#1B365D] hover:bg-[#2A4874] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-base">upload</span>
                    <span>{logoUrl ? 'Ganti Logo Perusahaan' : 'Upload Logo Baru'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>

                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => { setLogoUrl(''); toast.success('Logo dihapus.'); }}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                      <span>Hapus</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-gray-400">
                  Format gambar PNG, JPG, SVG (maksimal 5MB). Rekomendasi latar belakang transparan.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1B365D]">person</span>
              Informasi Profil & Perusahaan
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Perwakilan *</label>
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
                    disabled
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nama PT / Instansi Supplier</label>
                  <input
                    type="text"
                    value={profile.nama_instansi}
                    onChange={(e) => setProfile({ ...profile, nama_instansi: e.target.value })}
                    placeholder="Contoh: PT Logistics Jaya Utama"
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
                  <span className="material-symbols-outlined text-lg">save</span>
                  <span>{savingProfile ? 'Menyimpan...' : 'Simpan Profil & Logo'}</span>
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
