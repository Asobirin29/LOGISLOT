'use client';

import { useState } from 'react';

interface DockState {
  id: string;
  name: string;
  category: string;
  status: 'Tersedia' | 'Bongkar' | 'Overstay' | 'Maintenance';
  plateNumber?: string;
  supplier?: string;
  elapsedMinutes?: number;
  progressPercent?: number;
}

interface QueueItem {
  id: string;
  plateNumber: string;
  supplier: string;
  category: string;
  waitingMinutes: number;
}

const INITIAL_DOCKS: DockState[] = [
  { id: '1', name: 'Dock 1', category: 'Raw Material', status: 'Tersedia' },
  { id: '2', name: 'Dock 2', category: 'Packaging', status: 'Bongkar', plateNumber: 'B 9876 XYZ', supplier: 'PT. Kemas Maju', elapsedMinutes: 45, progressPercent: 60 },
  { id: '3', name: 'Dock 3', category: 'Spare Parts', status: 'Overstay', plateNumber: 'L 1234 ABC', supplier: 'Global Parts Inc.', elapsedMinutes: 105, progressPercent: 100 },
  { id: '4', name: 'Dock 4', category: 'Chemicals', status: 'Maintenance' },
];

const INITIAL_QUEUE: QueueItem[] = [
  { id: 'q1', plateNumber: 'D 4567 EF', supplier: 'PT. Distribusi Lancar', category: 'Raw Material', waitingMinutes: 12 },
  { id: 'q2', plateNumber: 'B 1122 QQ', supplier: 'Logistik Utama', category: 'Packaging', waitingMinutes: 25 },
  { id: 'q3', plateNumber: 'A 9988 ZA', supplier: 'Bina Karya', category: 'Spare Parts', waitingMinutes: 40 },
];

export default function WarehouseDashboardPage() {
  const [docks, setDocks] = useState<DockState[]>(INITIAL_DOCKS);
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);

  // Modals state
  const [unloadingModalDock, setUnloadingModalDock] = useState<DockState | null>(null);
  const [assigningQueueItem, setAssigningQueueItem] = useState<QueueItem | null>(null);
  const [isManageDocksOpen, setIsManageDocksOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states inside verification modal
  const [isQuantityMatch, setIsQuantityMatch] = useState<boolean | null>(true);
  const [discrepancyNote, setDiscrepancyNote] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCallTruck = (dock: DockState) => {
    showToast(`Panggilan suara ke pengemudi untuk ${dock.name} dikirim!`);
  };

  const handleCompleteUnloading = () => {
    if (!unloadingModalDock) return;
    setDocks(prev => prev.map(d => d.id === unloadingModalDock.id ? {
      ...d,
      status: 'Tersedia',
      plateNumber: undefined,
      supplier: undefined,
      elapsedMinutes: undefined,
      progressPercent: undefined
    } : d));

    showToast(`Bongkar muat di ${unloadingModalDock.name} (${unloadingModalDock.plateNumber}) berhasil diselesaikan.`);
    setUnloadingModalDock(null);
    setIsQuantityMatch(true);
    setDiscrepancyNote('');
    setAdditionalNote('');
  };

  const handleAssignDockToQueue = (targetDockId: string) => {
    if (!assigningQueueItem) return;
    const targetDock = docks.find(d => d.id === targetDockId);
    if (!targetDock) return;

    setDocks(prev => prev.map(d => d.id === targetDockId ? {
      ...d,
      status: 'Bongkar',
      plateNumber: assigningQueueItem.plateNumber,
      supplier: assigningQueueItem.supplier,
      elapsedMinutes: 0,
      progressPercent: 10
    } : d));

    setQueue(prev => prev.filter(q => q.id !== assigningQueueItem.id));
    showToast(`Truk ${assigningQueueItem.plateNumber} berhasil diarahkan ke ${targetDock.name}!`);
    setAssigningQueueItem(null);
  };

  const handleToggleDockStatus = (dockId: string, newStatus: DockState['status']) => {
    setDocks(prev => prev.map(d => d.id === dockId ? { ...d, status: newStatus } : d));
    showToast(`Status ${dockId} diubah ke ${newStatus}`);
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-lg pb-lg relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto">
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Denah Loading Dock — Real-Time</h2>
        <button 
          onClick={() => setIsManageDocksOpen(true)}
          className="bg-surface-container-lowest border border-secondary text-secondary hover:bg-surface-container-low transition-colors px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Kelola Status Dock
        </button>
      </header>

      {/* Bento Grid for Docks */}
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {docks.map((dock) => {
          if (dock.status === 'Tersedia') {
            return (
              <div key={dock.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant relative overflow-hidden flex flex-col justify-between h-64 shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#2E7D32]"></div>
                <div className="p-md flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{dock.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{dock.category}</p>
                  </div>
                  <span className="bg-[#E8F5E9] text-[#2E7D32] px-sm py-xs rounded-full font-label-md text-label-md font-bold">Tersedia</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-[48px] mb-sm opacity-50">door_sliding</span>
                  <p className="font-label-md text-label-md">Menunggu Truk</p>
                </div>
                <div className="p-md mt-auto">
                  <button 
                    onClick={() => handleCallTruck(dock)}
                    className="w-full bg-primary text-on-primary py-sm rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm"
                  >
                    Panggil Truk
                  </button>
                </div>
              </div>
            );
          }

          if (dock.status === 'Bongkar') {
            return (
              <div key={dock.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant relative overflow-hidden flex flex-col justify-between h-64 shadow-[0_4px_12px_rgba(27,54,93,0.08)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#F9A825]"></div>
                <div className="p-md pb-xs flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{dock.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{dock.category}</p>
                  </div>
                  <span className="bg-[#FFFDE7] text-[#F9A825] px-sm py-xs rounded-full font-label-md text-label-md font-bold">Bongkar</span>
                </div>
                <div className="px-md flex flex-col gap-sm mt-sm">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-outline text-[20px]">local_shipping</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{dock.plateNumber}</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">{dock.supplier}</p>
                  <div className="mt-xs">
                    <div className="flex justify-between font-label-md text-label-md mb-xs">
                      <span className="text-on-surface-variant flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">timer</span> Sudah {dock.elapsedMinutes} menit</span>
                      <span className="text-secondary font-bold">{dock.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                      <div className="bg-[#F9A825] h-full" style={{ width: `${dock.progressPercent}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="p-md mt-auto">
                  <button 
                    onClick={() => setUnloadingModalDock(dock)}
                    className="w-full bg-surface-container-lowest border border-secondary text-secondary py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                  >
                    Selesai Bongkar
                  </button>
                </div>
              </div>
            );
          }

          if (dock.status === 'Overstay') {
            return (
              <div key={dock.id} className="bg-[#FFEBEE] rounded-xl border-2 border-[#C62828] relative overflow-hidden flex flex-col justify-between h-64 shadow-[0_4px_12px_rgba(198,40,40,0.15)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#C62828]"></div>
                <div className="p-md pb-xs flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">{dock.name}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">{dock.category}</p>
                  </div>
                  <span className="bg-[#C62828] text-white px-sm py-xs rounded-full font-label-md text-label-md font-bold flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[14px]">warning</span> Overstay!
                  </span>
                </div>
                <div className="px-md flex flex-col gap-sm mt-sm">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-outline text-[20px]">local_shipping</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{dock.plateNumber}</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">{dock.supplier}</p>
                  <div className="mt-xs">
                    <div className="flex font-label-md text-label-md mb-xs text-[#C62828] font-bold items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">timer</span> Sudah {dock.elapsedMinutes} menit (Batas: 60m)
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                      <div className="bg-[#C62828] h-full w-full"></div>
                    </div>
                  </div>
                </div>
                <div className="p-md mt-auto">
                  <button 
                    onClick={() => setUnloadingModalDock(dock)}
                    className="w-full bg-[#C62828] text-white py-sm rounded-lg font-label-md text-label-md hover:bg-[#B71C1C] transition-colors shadow-sm"
                  >
                    Selesai Bongkar (Force)
                  </button>
                </div>
              </div>
            );
          }

          // Maintenance
          return (
            <div key={dock.id} className="bg-surface-variant rounded-xl border border-outline-variant relative overflow-hidden flex flex-col justify-between h-64 opacity-75">
              <div className="absolute top-0 left-0 w-full h-1 bg-outline"></div>
              <div className="p-md flex justify-between items-start">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-outline">{dock.name}</h3>
                  <p className="font-body-md text-body-md text-outline">{dock.category}</p>
                </div>
                <span className="bg-surface-container-highest text-outline px-sm py-xs rounded-full font-label-md text-label-md font-bold">Maintenance</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[48px] mb-sm">build</span>
                <p className="font-label-md text-label-md font-bold">Dalam Perbaikan</p>
                <p className="font-body-md text-body-md text-[12px] mt-xs">Estimasi: 2 Hari</p>
              </div>
              <div className="p-md mt-auto">
                <button 
                  onClick={() => handleToggleDockStatus(dock.id, 'Tersedia')}
                  className="w-full bg-surface-container border border-outline text-on-surface py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                >
                  Set Aktif
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Antrian Menunggu Dock */}
      <div className="w-full max-w-[1440px] mx-auto mt-lg bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-md">Antrian Menunggu Dock ({queue.length})</h3>
        
        {queue.length === 0 ? (
          <p className="text-on-surface-variant text-sm py-4">Tidak ada antrian truk saat ini.</p>
        ) : (
          <div className="flex overflow-x-auto gap-md pb-xs snap-x">
            {queue.map((item) => (
              <div key={item.id} className="min-w-[280px] border border-outline-variant rounded-lg p-md bg-background flex flex-col gap-sm snap-start">
                <div className="flex justify-between items-center">
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{item.plateNumber}</span>
                  <span className="bg-secondary-container text-on-secondary-container text-[11px] px-2 py-1 rounded font-bold">
                    Menunggu {item.waitingMinutes}m
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">{item.supplier} - {item.category}</p>
                <button 
                  onClick={() => setAssigningQueueItem(item)}
                  className="mt-sm flex items-center justify-center gap-xs w-full bg-primary text-on-primary py-1.5 rounded text-sm hover:bg-primary-container transition-colors shadow-sm font-semibold"
                >
                  Pilih Dock <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Finish Unloading Modal */}
      {unloadingModalDock && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-md">
          <div className="bg-surface-container-lowest w-full max-w-[460px] rounded-xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-lg border-b border-outline-variant flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
              </div>
              <h2 className="text-[18px] font-bold text-on-surface">Verifikasi Penerimaan Barang</h2>
            </div>
            
            <div className="p-lg overflow-y-auto max-h-[70vh] flex flex-col gap-lg">
              <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant grid grid-cols-2 gap-y-sm gap-x-md">
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Plat Nomor</p>
                  <p className="text-body-md font-semibold text-on-surface">{unloadingModalDock.plateNumber || 'B 9876 XYZ'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Dock</p>
                  <p className="text-body-md font-semibold text-on-surface">{unloadingModalDock.name}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Supplier</p>
                  <p className="text-body-md font-semibold text-on-surface">{unloadingModalDock.supplier || 'PT. Kemas Maju'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Durasi Bongkar</p>
                  <p className="text-body-md font-semibold text-on-surface">{unloadingModalDock.elapsedMinutes} menit</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-sm">
                <label className="text-label-md text-on-surface-variant">Kuantitas Diterima Sesuai PO?</label>
                <div className="grid grid-cols-2 gap-sm">
                  <button 
                    type="button"
                    onClick={() => setIsQuantityMatch(true)}
                    className={`flex flex-col items-center gap-xs p-md border rounded-lg transition-all ${
                      isQuantityMatch === true ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-outline-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#2E7D32]">check_circle</span>
                    <span className="text-label-md font-bold">Ya, Sesuai</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsQuantityMatch(false)}
                    className={`flex flex-col items-center gap-xs p-md border rounded-lg transition-all ${
                      isQuantityMatch === false ? 'border-2 border-red-600 bg-red-50 text-red-800' : 'border-outline-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#C62828]">error</span>
                    <span className="text-label-md font-bold">Tidak Sesuai</span>
                  </button>
                </div>
              </div>

              {!isQuantityMatch && (
                <div className="flex flex-col gap-xs">
                  <label className="text-label-md text-on-surface-variant">Catatan Ketidaksesuaian</label>
                  <textarea 
                    value={discrepancyNote}
                    onChange={(e) => setDiscrepancyNote(e.target.value)}
                    className="w-full p-md border border-outline-variant rounded-lg bg-surface text-body-md focus:ring-2 focus:ring-primary outline-none min-h-[80px]" 
                    placeholder="Jelaskan selisih jumlah atau kondisi barang..."
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-xs">
                <label className="text-label-md text-on-surface-variant">Catatan Tambahan (opsional)</label>
                <textarea 
                  value={additionalNote}
                  onChange={(e) => setAdditionalNote(e.target.value)}
                  className="w-full p-md border border-outline-variant rounded-lg bg-surface text-body-md focus:ring-2 focus:ring-primary outline-none min-h-[60px]" 
                  placeholder="Tambahkan catatan jika ada..."
                />
              </div>
            </div>
            
            <div className="p-lg border-t border-outline-variant flex gap-md">
              <button 
                type="button"
                onClick={() => setUnloadingModalDock(null)} 
                className="flex-1 py-sm border border-outline text-on-surface-variant rounded-lg font-label-md hover:bg-surface-container-low transition-colors"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleCompleteUnloading} 
                className="flex-1 py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-sm"
              >
                Konfirmasi Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Queue Item Modal */}
      {assigningQueueItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setAssigningQueueItem(null)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-[480px] p-6 shadow-2xl z-10 border border-outline-variant space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-headline-md text-headline-md font-bold text-primary">
              Alokasikan Dock untuk Truk ({assigningQueueItem.plateNumber})
            </h3>
            <p className="text-sm text-on-surface-variant">
              Pilih dock yang tersedia untuk pengiriman material <strong>{assigningQueueItem.category}</strong>.
            </p>

            <div className="space-y-2">
              {docks.map(d => (
                <button
                  key={d.id}
                  disabled={d.status !== 'Tersedia'}
                  onClick={() => handleAssignDockToQueue(d.id)}
                  className={`w-full p-3 rounded-lg border text-left flex justify-between items-center transition-colors ${
                    d.status === 'Tersedia' 
                      ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-100 cursor-pointer' 
                      : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <span className="font-bold text-on-surface block">{d.name} ({d.category})</span>
                    <span className="text-xs text-on-surface-variant">Status: {d.status}</span>
                  </div>
                  {d.status === 'Tersedia' && (
                    <span className="material-symbols-outlined text-emerald-700">arrow_forward</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setAssigningQueueItem(null)} className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface">Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Docks Modal */}
      {isManageDocksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setIsManageDocksOpen(false)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-[540px] p-6 shadow-2xl z-10 border border-outline-variant space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md font-bold text-primary">Kelola Status Seluruh Dock</h3>
              <button onClick={() => setIsManageDocksOpen(false)} className="text-outline hover:text-on-surface p-1 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {docks.map(d => (
                <div key={d.id} className="p-3 border border-outline-variant rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-on-surface">{d.name}</span>
                    <span className="text-xs text-on-surface-variant block">{d.category} — {d.status}</span>
                  </div>
                  <select
                    value={d.status}
                    onChange={(e) => handleToggleDockStatus(d.id, e.target.value as DockState['status'])}
                    className="border border-outline-variant rounded px-2 py-1 text-sm bg-white focus:outline-none"
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Bongkar">Bongkar</option>
                    <option value="Overstay">Overstay</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-outline-variant">
              <button onClick={() => setIsManageDocksOpen(false)} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md shadow-sm">Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

