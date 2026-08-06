'use client';

import { useState } from 'react';

interface TimeSlotItem {
  id: string;
  startTime: string;
  endTime: string;
  quota: number;
  days: string[]; // ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
}

const ALL_DAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const INITIAL_SLOTS: TimeSlotItem[] = [
  { id: '1', startTime: '00:00', endTime: '04:00', quota: 3, days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'] },
  { id: '2', startTime: '04:00', endTime: '08:00', quota: 5, days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] },
  { id: '3', startTime: '08:00', endTime: '12:00', quota: 8, days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'] },
  { id: '4', startTime: '13:00', endTime: '17:00', quota: 6, days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'] },
];

export default function TimeSlotPage() {
  const [slots, setSlots] = useState<TimeSlotItem[]>(INITIAL_SLOTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlotItem | null>(null);
  const [deletingSlot, setDeletingSlot] = useState<TimeSlotItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    startTime: '08:00',
    endTime: '12:00',
    quota: 5,
    days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum']
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingSlot(null);
    setFormData({
      startTime: '17:00',
      endTime: '21:00',
      quota: 5,
      days: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot: TimeSlotItem) => {
    setEditingSlot(slot);
    setFormData({
      startTime: slot.startTime,
      endTime: slot.endTime,
      quota: slot.quota,
      days: [...slot.days]
    });
    setIsModalOpen(true);
  };

  const handleToggleDay = (day: string) => {
    setFormData(prev => {
      const exists = prev.days.includes(day);
      return {
        ...prev,
        days: exists ? prev.days.filter(d => d !== day) : [...prev.days, day]
      };
    });
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime || formData.quota <= 0) {
      showToast('Harap atur jam operasional dan kuota dengan benar!');
      return;
    }

    if (editingSlot) {
      setSlots(prev => prev.map(s => s.id === editingSlot.id ? { ...s, ...formData } : s));
      showToast(`Slot ${formData.startTime} - ${formData.endTime} berhasil diperbarui!`);
    } else {
      const newSlot: TimeSlotItem = {
        id: String(Date.now()),
        startTime: formData.startTime,
        endTime: formData.endTime,
        quota: formData.quota,
        days: formData.days
      };
      setSlots(prev => [...prev, newSlot]);
      showToast(`Slot jam ${formData.startTime} - ${formData.endTime} berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
    setEditingSlot(null);
  };

  const handleDeleteSlot = () => {
    if (deletingSlot) {
      setSlots(prev => prev.filter(s => s.id !== deletingSlot.id));
      showToast(`Slot jam ${deletingSlot.startTime} - ${deletingSlot.endTime} berhasil dihapus!`);
      setDeletingSlot(null);
    }
  };

  const handleQuickUpdateQuota = (id: string, newQuota: number) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, quota: Math.max(1, newQuota) } : s));
    showToast('Kuota berhasil diperbarui!');
  };

  return (
    <div className="p-lg max-w-container-max mx-auto w-full flex-1 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center mb-lg">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary-container">Pengaturan Jam Operasional & Kuota</h2>
        <button 
          onClick={handleOpenAdd}
          className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-container transition-colors flex items-center gap-2 active:opacity-80 shadow-sm"
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Slot
        </button>
      </div>
      
      {/* Info Box */}
      <div className="bg-surface-container-low border border-secondary-fixed rounded-lg p-md mb-lg flex items-start gap-md">
        <span className="material-symbols-outlined text-secondary mt-1">info</span>
        <div>
          <p className="font-body-md text-body-md text-on-surface">
            Total kapasitas per hari saat ini: <strong className="text-primary font-bold">{slots.reduce((acc, curr) => acc + (curr.quota * 4), 0)} slot truk</strong> ({slots.length} konfigurasi jam operasional)
          </p>
        </div>
      </div>
      
      {/* Settings Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-outline-variant">
                <th className="font-label-md text-label-md text-on-surface-variant py-4 px-6">Jam Mulai</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-4 px-6">Jam Selesai</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-4 px-6">Kuota Maksimal per Dock</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-4 px-6">Berlaku untuk Hari</th>
                <th className="font-label-md text-label-md text-on-surface-variant py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface">
              {slots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">Belum ada slot waktu terkonfigurasi.</td>
                </tr>
              ) : (
                slots.map((slot) => (
                  <tr key={slot.id} className="border-b border-outline-variant hover:bg-surface-bright transition-colors">
                    <td className="py-4 px-6 font-code font-bold text-primary">{slot.startTime}</td>
                    <td className="py-4 px-6 font-code font-bold text-primary">{slot.endTime}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <input 
                          className="w-16 px-2 py-1 border border-outline-variant rounded text-center focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm font-semibold" 
                          type="number" 
                          value={slot.quota} 
                          onChange={(e) => handleQuickUpdateQuota(slot.id, parseInt(e.target.value) || 1)}
                        />
                        <button 
                          onClick={() => handleOpenEdit(slot)}
                          className="text-outline hover:text-secondary transition-colors p-1" 
                          title="Edit Detil Slot"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-1 flex-wrap">
                        {ALL_DAYS.map(day => {
                          const isActive = slot.days.includes(day);
                          return (
                            <span 
                              key={day} 
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                isActive ? 'bg-primary text-on-primary' : 'border border-outline text-outline font-medium opacity-60'
                              }`}
                            >
                              {day}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => setDeletingSlot(slot)}
                        className="text-error opacity-70 hover:opacity-100 hover:bg-error-container p-2 rounded-full transition-all" 
                        title="Hapus Slot"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Time Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <form 
            onSubmit={handleSaveSlot}
            className="relative bg-white rounded-xl w-full max-w-[480px] p-lg shadow-2xl z-10 border border-outline-variant space-y-md animate-in fade-in zoom-in-95"
          >
            <div className="flex justify-between items-center border-b border-outline-variant pb-md">
              <h3 className="font-headline-md text-headline-md font-bold text-primary">
                {editingSlot ? 'Edit Konfigurasi Slot' : 'Tambah Slot Waktu Baru'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-outline hover:text-on-surface p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface">Jam Mulai</label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:outline-none"
                />
              </div>
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface">Jam Selesai</label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-xs">
              <label className="block font-label-md text-label-md text-on-surface">Kuota Maksimal Truk per Dock</label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={formData.quota}
                onChange={(e) => setFormData({ ...formData, quota: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:outline-none"
              />
            </div>

            <div className="space-y-xs">
              <label className="block font-label-md text-label-md text-on-surface">Hari Operasional</label>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {ALL_DAYS.map(day => {
                  const selected = formData.days.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => handleToggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                        selected ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface border border-outline-variant'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-md pt-md border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container-low"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container shadow-sm"
              >
                {editingSlot ? 'Simpan Slot' : 'Tambah Slot'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setDeletingSlot(null)}></div>
          <div className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl z-10 border border-outline-variant">
            <h3 className="font-headline-md text-headline-md font-bold text-error mb-2">Hapus Slot Operasional</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Apakah Anda yakin ingin menghapus slot <strong>{deletingSlot.startTime} - {deletingSlot.endTime}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeletingSlot(null)} className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low font-label-md">
                Batal
              </button>
              <button onClick={handleDeleteSlot} className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 font-label-md shadow-sm">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
