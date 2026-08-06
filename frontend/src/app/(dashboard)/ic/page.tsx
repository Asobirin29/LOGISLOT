'use client';

import { useState } from 'react';

interface ArrivalItem {
  id: string;
  poNumber: string;
  supplier: string;
  plateNumber: string;
  dock: string;
  slotTime: string;
  status: 'Di Gerbang' | 'Menunggu Dock' | 'Bongkar' | 'Selesai';
  priority: 'Urgent' | 'Normal';
  slaNote?: string;
  driverName: string;
  itemManifest: string;
}

const INITIAL_ARRIVALS: ArrivalItem[] = [
  {
    id: '1',
    poNumber: 'PO-2023-8891',
    supplier: 'PT Sumber Baja Persada',
    plateNumber: 'B 9012 KJL',
    dock: 'Dock 04',
    slotTime: '10:00 - 11:30',
    status: 'Menunggu Dock',
    priority: 'Urgent',
    slaNote: '+45m Over SLA',
    driverName: 'Susilo Bambang',
    itemManifest: 'Raw Steel Coils (50 Tons)'
  },
  {
    id: '2',
    poNumber: 'PO-2023-8892',
    supplier: 'CV Makmur Jaya Packing',
    plateNumber: 'D 1455 HGY',
    dock: 'Dock 01',
    slotTime: '10:30 - 11:30',
    status: 'Bongkar',
    priority: 'Normal',
    driverName: 'Tono Hartono',
    itemManifest: 'Cardboard Boxes & Bubblewrap (200 Units)'
  },
  {
    id: '3',
    poNumber: 'PO-2023-8895',
    supplier: 'PT Global Logistik Nusantara',
    plateNumber: 'L 8821 PP',
    dock: 'Dock 07',
    slotTime: '11:00 - 12:00',
    status: 'Di Gerbang',
    priority: 'Normal',
    slaNote: 'SLA -10m',
    driverName: 'Kiki Ramadhan',
    itemManifest: 'Heavy Spare Machinery Parts (15 Crate)'
  }
];

export default function ICMonitoringPage() {
  const [arrivals, setArrivals] = useState<ArrivalItem[]>(INITIAL_ARRIVALS);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailItem, setDetailItem] = useState<ArrivalItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePriority = (id: string) => {
    setArrivals(prev => prev.map(item => {
      if (item.id === id) {
        const nextPrio = item.priority === 'Urgent' ? 'Normal' : 'Urgent';
        showToast(`Prioritas ${item.poNumber} diubah ke ${nextPrio}`);
        return { ...item, priority: nextPrio };
      }
      return item;
    }));
  };

  const filteredArrivals = arrivals.filter(item => {
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    const matchesSearch = item.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full flex-1 flex flex-col p-gutter max-w-container-max mx-auto h-full overflow-y-auto bg-[#F4F6F9] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-center mb-xl">
        <div className="flex items-center space-x-3">
          <h2 className="font-headline-lg text-headline-lg text-[#1B365D] font-bold">Monitoring Kedatangan Material</h2>
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-label-md border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse inline-block"></span>
            Live
          </div>
        </div>
        <div className="text-sm text-outline font-code">Last updated: Just now</div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
        <div className="bg-white p-lg rounded-lg border border-outline-variant flex items-center justify-between shadow-sm">
          <div>
            <p className="font-label-md text-label-md text-outline uppercase mb-1">Total Hari Ini</p>
            <p className="font-headline-lg text-headline-lg text-on-surface font-bold">142</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[28px]">local_shipping</span>
          </div>
        </div>

        <div className="bg-white p-lg rounded-lg border border-outline-variant flex items-center justify-between shadow-sm">
          <div>
            <p className="font-label-md text-label-md text-outline uppercase mb-1">Sedang di Gerbang</p>
            <p className="font-headline-lg text-headline-lg text-yellow-600 font-bold">12</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
            <span className="material-symbols-outlined text-[28px]">door_front</span>
          </div>
        </div>

        <div className="bg-white p-lg rounded-lg border border-outline-variant flex items-center justify-between shadow-sm">
          <div>
            <p className="font-label-md text-label-md text-outline uppercase mb-1">Sedang Bongkar</p>
            <p className="font-headline-lg text-headline-lg text-secondary font-bold">8</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[28px]">inventory_2</span>
          </div>
        </div>

        <div className="bg-white p-lg rounded-lg border border-outline-variant flex items-center justify-between relative overflow-hidden shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
          <div>
            <p className="font-label-md text-label-md text-outline uppercase mb-1">Terlambat / Over SLA</p>
            <p className="font-headline-lg text-headline-lg text-error font-bold">3</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[28px]">timer_off</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-md rounded-t-lg border border-outline-variant border-b-0 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <select className="appearance-none bg-surface border border-outline-variant text-on-surface font-body-md rounded-lg pl-3 pr-10 py-2 focus:ring-secondary focus:border-secondary h-10 cursor-pointer">
              <option>Today, 24 Oct</option>
              <option>Yesterday</option>
              <option>This Week</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            </div>
          </div>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-surface border border-outline-variant text-on-surface font-body-md rounded-lg pl-3 pr-10 py-2 focus:ring-secondary focus:border-secondary h-10 w-48 cursor-pointer"
            >
              <option>All Status</option>
              <option>Di Gerbang</option>
              <option>Menunggu Dock</option>
              <option>Bongkar</option>
              <option>Selesai</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </div>
          </div>
        </div>
        <div className="relative flex items-center bg-surface border border-outline-variant rounded-lg h-10 w-64 focus-within:border-secondary transition-colors">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </div>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-body-md pl-10 pr-3 py-0 w-full placeholder:text-outline text-on-surface outline-none h-full" 
            placeholder="Filter by PO/Supplier..." 
            type="text"
          />
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-outline-variant rounded-b-lg overflow-hidden flex-1 overflow-y-auto shadow-sm">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#F4F6F9] z-10 shadow-sm">
              <tr className="border-b border-outline-variant font-label-md text-label-md text-outline uppercase tracking-wider">
                <th className="p-4 py-3 whitespace-nowrap">PO</th>
                <th className="p-4 py-3 whitespace-nowrap">Supplier</th>
                <th className="p-4 py-3 whitespace-nowrap">Plat Nomor</th>
                <th className="p-4 py-3 whitespace-nowrap">Dock Tujuan</th>
                <th className="p-4 py-3 whitespace-nowrap">Jadwal Slot</th>
                <th className="p-4 py-3 whitespace-nowrap">Status</th>
                <th className="p-4 py-3 whitespace-nowrap">Prioritas</th>
                <th className="p-4 py-3 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface">
              {filteredArrivals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-on-surface-variant">Tidak ada data kedatangan material matching filter.</td>
                </tr>
              ) : (
                filteredArrivals.map((item) => (
                  <tr key={item.id} className="even:bg-[#FAFBFC] border-b border-outline-variant hover:bg-surface-container-low transition-colors relative">
                    {item.priority === 'Urgent' && <td className="absolute left-0 top-0 bottom-0 w-1 bg-error"></td>}
                    <td className="p-4 pl-5 whitespace-nowrap font-code text-code text-primary font-bold">{item.poNumber}</td>
                    <td className="p-4 whitespace-nowrap font-semibold">{item.supplier}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="inline-flex items-center bg-surface-container border border-outline-variant rounded px-2 py-1 font-code text-code font-bold">
                        {item.plateNumber}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">{item.dock}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{item.slotTime}</span>
                        {item.slaNote && (
                          <span className={`text-xs font-semibold mt-1 flex items-center ${item.slaNote.includes('Over') ? 'text-error' : 'text-yellow-600'}`}>
                            <span className="material-symbols-outlined text-[14px] mr-1">warning</span>
                            {item.slaNote}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {item.priority === 'Urgent' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error-container text-error border border-error/30">
                          <span className="material-symbols-outlined text-[14px] mr-1">local_fire_department</span>
                          Urgent
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap text-right space-x-2">
                      <button 
                        onClick={() => handleTogglePriority(item.id)}
                        className="inline-flex items-center justify-center px-2.5 py-1.5 border border-outline text-on-surface rounded hover:bg-surface-container transition-colors text-label-md font-label-md"
                        title="Tandai Priority"
                      >
                        <span className={`material-symbols-outlined text-[16px] mr-1 ${item.priority === 'Urgent' ? 'text-error font-bold' : 'text-outline'}`}>flag</span>
                        {item.priority === 'Urgent' ? 'Unmark' : 'Urgent'}
                      </button>
                      <button 
                        onClick={() => setDetailItem(item)}
                        className="inline-flex items-center justify-center px-3 py-1.5 bg-primary text-on-primary rounded hover:bg-primary-container transition-colors text-label-md font-label-md shadow-sm"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Footer */}
      <div className="mt-4 flex items-center justify-between text-body-md text-outline">
        <span>Menampilkan 1-{filteredArrivals.length} dari {arrivals.length} data hari ini</span>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface disabled:opacity-50" disabled>&lt;</button>
          <button className="px-3 py-1 border border-secondary bg-secondary-fixed text-secondary font-bold rounded">1</button>
          <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface" disabled>&gt;</button>
        </div>
      </div>

      {/* PO Detail & Material Inspection Modal */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setDetailItem(null)}></div>
          <div className="relative bg-white rounded-xl w-full max-w-[500px] p-6 shadow-2xl z-10 border border-outline-variant space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
              <div>
                <h3 className="font-headline-md text-headline-md font-bold text-primary">Detail Manifest PO ({detailItem.poNumber})</h3>
                <p className="text-xs text-on-surface-variant">Laporan pemeriksaan material Inventory Control</p>
              </div>
              <button onClick={() => setDetailItem(null)} className="text-outline hover:text-on-surface p-1 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-surface p-3 rounded-lg border border-outline-variant space-y-2">
                <div className="flex justify-between"><span className="text-outline">Supplier:</span><span className="font-bold text-on-surface">{detailItem.supplier}</span></div>
                <div className="flex justify-between"><span className="text-outline">Plat Nomor Truk:</span><span className="font-code font-bold text-primary">{detailItem.plateNumber}</span></div>
                <div className="flex justify-between"><span className="text-outline">Driver:</span><span className="font-semibold text-on-surface">{detailItem.driverName}</span></div>
                <div className="flex justify-between"><span className="text-outline">Dock Tujuan:</span><span className="font-bold text-secondary">{detailItem.dock}</span></div>
                <div className="flex justify-between"><span className="text-outline">Jadwal Slot:</span><span>{detailItem.slotTime}</span></div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-on-surface">Rincian Manifest Material:</label>
                <div className="p-3 bg-surface-container-low border border-outline-variant rounded-lg font-mono text-xs text-on-surface">
                  {detailItem.itemManifest}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
                <span className="font-bold">Status SLA Kedatangan:</span>
                <span className="font-bold">{detailItem.slaNote || 'On Schedule (Normal)'}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-outline-variant">
              <button onClick={() => setDetailItem(null)} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md shadow-sm">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

