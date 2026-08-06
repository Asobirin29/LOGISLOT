'use client';

import { useState } from 'react';

interface DockItem {
  id: string;
  name: string;
  category: string;
  capacity: number;
  status: 'Aktif' | 'Maintenance';
}

const INITIAL_DOCKS: DockItem[] = [
  { id: '1', name: 'Dock 1', category: 'Raw Material', capacity: 1, status: 'Aktif' },
  { id: '2', name: 'Dock 2', category: 'Packaging', capacity: 2, status: 'Aktif' },
  { id: '3', name: 'Dock 3', category: 'Spare Parts', capacity: 1, status: 'Maintenance' },
  { id: '4', name: 'Dock 4', category: 'Finished Goods', capacity: 3, status: 'Aktif' },
];

export default function LoadingDockPage() {
  const [docks, setDocks] = useState<DockItem[]>(INITIAL_DOCKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDock, setEditingDock] = useState<DockItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    capacity: 1,
    status: 'Aktif' as 'Aktif' | 'Maintenance'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingDock(null);
    setFormData({
      name: `Dock ${docks.length + 1}`,
      category: 'Raw Material',
      capacity: 1,
      status: 'Aktif'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dock: DockItem) => {
    setEditingDock(dock);
    setFormData({
      name: dock.name,
      category: dock.category,
      capacity: dock.capacity,
      status: dock.status
    });
    setIsModalOpen(true);
  };

  const handleSaveDock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      showToast('Harap lengkapi semua field!');
      return;
    }

    if (editingDock) {
      setDocks(prev => prev.map(d => d.id === editingDock.id ? { ...d, ...formData } : d));
      showToast(`${formData.name} berhasil diperbarui!`);
    } else {
      const newDock: DockItem = {
        id: String(Date.now()),
        name: formData.name,
        category: formData.category,
        capacity: formData.capacity,
        status: formData.status
      };
      setDocks(prev => [...prev, newDock]);
      showToast(`${formData.name} berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
    setEditingDock(null);
  };

  const handleToggleStatus = (id: string) => {
    setDocks(prev => prev.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'Aktif' ? 'Maintenance' : 'Aktif';
        showToast(`Status ${d.name} diubah menjadi ${nextStatus}`);
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="px-xl py-lg flex justify-between items-center border-b border-outline-variant bg-surface-container-lowest z-10 sticky top-0">
        <h1 className="font-headline-lg text-headline-lg font-bold text-primary-container">Manajemen Loading Dock</h1>
        <button 
          onClick={handleOpenAdd}
          className="bg-primary text-on-primary font-label-md text-label-md py-sm px-md rounded-lg flex items-center gap-sm hover:bg-primary-container transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Tambah Dock Baru
        </button>
      </header>
      
      {/* Scrollable Content Canvas */}
      <div className="p-xl flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
          {docks.map((dock) => (
            <div 
              key={dock.id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col relative group hover:border-secondary transition-colors duration-200 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-md">
                <div>
                  <h2 className="font-headline-md text-headline-md text-primary font-bold">{dock.name}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-xs">{dock.category}</p>
                </div>
                <button 
                  onClick={() => handleOpenEdit(dock)}
                  className="text-on-surface-variant hover:text-primary hover:bg-slate-100 p-2 rounded-lg transition-colors flex items-center justify-center shrink-0"
                  title="Edit Dock"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              </div>
              <div className="mb-lg">
                <span className="inline-flex items-center px-sm py-xs rounded-full bg-surface-container-low text-on-surface text-label-md font-label-md border border-outline-variant">
                  Kapasitas: {dock.capacity} Truk
                </span>
              </div>
              <div className="mt-auto flex justify-between items-center pt-md border-t border-outline-variant">
                <span className={`font-label-md text-label-md uppercase tracking-wider ${dock.status === 'Maintenance' ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
                  Status: {dock.status}
                </span>
                
                {/* Toggle Button */}
                <button
                  onClick={() => handleToggleStatus(dock.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                    dock.status === 'Aktif' ? 'bg-emerald-500 justify-end' : 'bg-gray-300 justify-start'
                  }`}
                  title={`Ubah status ${dock.name}`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-sm block"></span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <form 
            onSubmit={handleSaveDock}
            className="relative bg-white rounded-xl w-full max-w-[480px] p-lg shadow-2xl z-10 border border-outline-variant space-y-md animate-in fade-in zoom-in-95"
          >
            <div className="flex justify-between items-center border-b border-outline-variant pb-md">
              <h3 className="font-headline-md text-headline-md font-bold text-primary">
                {editingDock ? 'Edit Loading Dock' : 'Tambah Dock Baru'}
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-outline hover:text-on-surface p-1 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface">Nama Dock</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md focus:border-secondary focus:outline-none"
                placeholder="Contoh: Dock 5"
              />
            </div>

            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface">Kategori Material</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md focus:border-secondary focus:outline-none"
              >
                <option value="Raw Material">Raw Material</option>
                <option value="Packaging">Packaging</option>
                <option value="Spare Parts">Spare Parts</option>
                <option value="Finished Goods">Finished Goods</option>
                <option value="Chemicals">Chemicals</option>
              </select>
            </div>

            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface">Kapasitas Maksimal Truk</label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md focus:border-secondary focus:outline-none"
              />
            </div>

            <div className="space-y-sm">
              <label className="block font-label-md text-label-md text-on-surface">Status Operasional</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Aktif' | 'Maintenance' })}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md focus:border-secondary focus:outline-none"
              >
                <option value="Aktif">Aktif</option>
                <option value="Maintenance">Maintenance</option>
              </select>
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
                {editingDock ? 'Simpan Perubahan' : 'Tambah Dock'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

