'use client';

import { useState } from 'react';

interface BookingItem {
  id: string;
  poNumber: string;
  plateNumber: string;
  date: string;
  timeSlot: string;
  dock: string;
  driverName: string;
  driverPhone: string;
  material: string;
  status: 'Booked' | 'Arrived' | 'Completed' | 'Cancelled';
}

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: '1',
    poNumber: 'PO-20231025-01',
    plateNumber: 'B 1234 CD',
    date: '25 Okt 2023',
    timeSlot: '14:00 - 15:00',
    dock: 'Dock A1',
    driverName: 'Sulaeman',
    driverPhone: '+62 812-9988-7766',
    material: 'Raw Aluminum Ingot',
    status: 'Booked'
  },
  {
    id: '2',
    poNumber: 'PO-20231025-02',
    plateNumber: 'D 5678 EF',
    date: '25 Okt 2023',
    timeSlot: '10:00 - 11:30',
    dock: 'Dock B2',
    driverName: 'Hendra Saputra',
    driverPhone: '+62 813-1122-3344',
    material: 'Cardboard Box Packaging',
    status: 'Arrived'
  },
  {
    id: '3',
    poNumber: 'PO-20231024-05',
    plateNumber: 'L 9012 GH',
    date: '24 Okt 2023',
    timeSlot: '08:00 - 09:00',
    dock: 'Dock A2',
    driverName: 'Bambang Tri',
    driverPhone: '+62 815-5544-3322',
    material: 'Steel Cables & Gears',
    status: 'Completed'
  },
  {
    id: '4',
    poNumber: 'PO-20231026-01',
    plateNumber: 'B 4321 XY',
    date: '26 Okt 2023',
    timeSlot: '15:00 - 16:30',
    dock: 'Dock C1',
    driverName: 'Rudi Hermawan',
    driverPhone: '+62 817-7788-9900',
    material: 'Plastic Resins',
    status: 'Cancelled'
  }
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals
  const [ticketModalBooking, setTicketModalBooking] = useState<BookingItem | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingItem | null>(null);
  const [cancelingBooking, setCancelingBooking] = useState<BookingItem | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Form state
  const [editForm, setEditForm] = useState({
    plateNumber: '',
    driverName: '',
    driverPhone: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEdit = (b: BookingItem) => {
    setEditingBooking(b);
    setEditForm({
      plateNumber: b.plateNumber,
      driverName: b.driverName,
      driverPhone: b.driverPhone
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    setBookings(prev => prev.map(b => b.id === editingBooking.id ? {
      ...b,
      plateNumber: editForm.plateNumber,
      driverName: editForm.driverName,
      driverPhone: editForm.driverPhone
    } : b));
    showToast(`Booking ${editingBooking.poNumber} berhasil diperbarui!`);
    setEditingBooking(null);
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelingBooking) return;
    setBookings(prev => prev.map(b => b.id === cancelingBooking.id ? { ...b, status: 'Cancelled' } : b));
    showToast(`Booking ${cancelingBooking.poNumber} telah dibatalkan.`);
    setCancelingBooking(null);
    setCancelReason('');
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'Semua Status' || b.status === statusFilter;
    const matchesSearch = b.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || b.date.toLowerCase().includes(dateFilter.toLowerCase());
    return matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusBadge = (status: BookingItem['status']) => {
    switch (status) {
      case 'Booked':
        return <div className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md shrink-0 w-24 text-center">Booked</div>;
      case 'Arrived':
        return <div className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md shrink-0 w-24 text-center">Arrived</div>;
      case 'Completed':
        return <div className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#137333] font-label-md text-label-md shrink-0 w-24 text-center">Completed</div>;
      case 'Cancelled':
        return <div className="px-3 py-1 rounded-full bg-[#F1F3F4] text-[#5F6368] font-label-md text-label-md shrink-0 w-24 text-center border border-outline-variant/50">Cancelled</div>;
    }
  };

  return (
    <main className="flex-1 p-lg max-w-[1440px] w-full mx-auto relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-primary-container text-on-primary px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-lg">
        <h1 className="text-[22px] font-bold text-primary-container mb-2">Booking Saya</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Kelola seluruh jadwal pengiriman Anda</p>
      </div>
      
      {/* Filter Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant mb-lg flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Dropdown Status */}
          <div className="relative min-w-[160px]">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-4 pr-10 font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cursor-pointer"
            >
              <option>Semua Status</option>
              <option>Booked</option>
              <option>Arrived</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </div>
          </div>
          {/* Date Picker */}
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            </div>
            <input 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cursor-pointer" 
              placeholder="Filter Tanggal (misal: 25 Okt)" 
              type="text"
            />
          </div>
        </div>
        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none" 
            placeholder="Cari PO atau Plat Nomor..." 
            type="text"
          />
        </div>
      </div>
      
      {/* Card List */}
      <div className="space-y-[12px] mb-xl">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant bg-surface-container-lowest rounded-xl border border-outline-variant">
            Tidak ada data booking matching pencarian.
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div 
              key={b.id} 
              className={`rounded-[10px] border border-outline-variant p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-[0_4px_12px_rgba(27,54,93,0.08)] transition-shadow ${
                b.status === 'Cancelled' ? 'bg-[#F8F9FA] opacity-75' : b.status === 'Completed' ? 'bg-surface-bright' : 'bg-surface-container-lowest'
              }`}
            >
              <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                {getStatusBadge(b.status)}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`font-headline-sm text-headline-sm text-on-surface ${b.status === 'Cancelled' ? 'line-through decoration-outline-variant' : ''}`}>
                      {b.poNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-surface-container-low border border-outline-variant rounded text-xs font-code text-on-surface-variant">
                      {b.plateNumber}
                    </span>
                  </div>
                  <div className="font-body-md text-body-md text-on-surface-variant flex flex-wrap items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">calendar_month</span> {b.date}
                    <span className="w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
                    <span className="material-symbols-outlined text-[16px]">schedule</span> {b.timeSlot}
                    <span className="w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
                    <span className="material-symbols-outlined text-[16px]">warehouse</span> {b.dock}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/50 w-full sm:w-auto justify-end">
                <button 
                  onClick={() => setTicketModalBooking(b)}
                  aria-label="Lihat Tiket" 
                  className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors tooltip-trigger relative group"
                  title="Lihat Tiket / QR Code Pass"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>

                {b.status === 'Booked' ? (
                  <>
                    <button 
                      onClick={() => handleOpenEdit(b)}
                      aria-label="Edit" 
                      className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors tooltip-trigger relative group"
                      title="Edit Booking"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button 
                      onClick={() => setCancelingBooking(b)}
                      aria-label="Batalkan" 
                      className="p-2 text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors tooltip-trigger relative group"
                      title="Batalkan Booking"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button aria-label="Edit" className="p-2 text-on-surface-variant opacity-40 cursor-not-allowed rounded-lg" disabled title="Tidak dapat diedit">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button aria-label="Batalkan" className="p-2 text-error opacity-40 cursor-not-allowed rounded-lg" disabled title="Tidak dapat dibatalkan">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-outline-variant pt-4">
        <div className="font-body-md text-body-md text-on-surface-variant hidden sm:block">
          Menampilkan 1-{filteredBookings.length} dari {bookings.length} booking
        </div>
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 transition-colors" disabled>
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-label-md text-label-md">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 transition-colors" disabled>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      {/* QR Ticket Modal */}
      {ticketModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setTicketModalBooking(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-[480px] p-6 shadow-2xl z-10 border border-outline-variant animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
              <div>
                <h3 className="font-headline-md text-headline-md font-bold text-primary">Digital Entry Pass</h3>
                <p className="font-body-md text-xs text-on-surface-variant">Tunjukkan ke petugas gate Security</p>
              </div>
              <button onClick={() => setTicketModalBooking(null)} className="text-outline hover:text-on-surface p-1 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* QR Code Graphic Container */}
            <div className="my-6 flex flex-col items-center justify-center p-6 bg-surface-container-low rounded-xl border border-dashed border-secondary/40">
              <div className="w-48 h-48 bg-white p-3 rounded-xl shadow-md border border-outline-variant flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" fill="#1B365D" />
                  <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" fill="#1B365D" />
                  <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" fill="#1B365D" />
                  <rect x="45" y="10" width="10" height="10" fill="#1B365D" />
                  <rect x="45" y="30" width="10" height="20" fill="#1B365D" />
                  <rect x="60" y="50" width="20" height="10" fill="#1B365D" />
                  <rect x="50" y="70" width="30" height="20" fill="#1B365D" />
                </svg>
              </div>
              <span className="font-code text-sm font-bold text-primary tracking-widest mt-3">
                {ticketModalBooking.poNumber}
              </span>
            </div>

            {/* Ticket Details */}
            <div className="space-y-3 bg-surface p-4 rounded-xl border border-outline-variant text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Plat Nomor:</span>
                <span className="font-bold text-on-surface">{ticketModalBooking.plateNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Driver:</span>
                <span className="font-semibold text-on-surface">{ticketModalBooking.driverName} ({ticketModalBooking.driverPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Jadwal Slot:</span>
                <span className="font-semibold text-primary">{ticketModalBooking.date} ({ticketModalBooking.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Dock Tujuan:</span>
                <span className="font-bold text-secondary">{ticketModalBooking.dock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Muatan Material:</span>
                <span className="text-on-surface">{ticketModalBooking.material}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => {
                  showToast('Tiket PDF berhasil diunduh!');
                }} 
                className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Cetak / Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setEditingBooking(null)}></div>
          <form onSubmit={handleSaveEdit} className="relative bg-white rounded-xl w-full max-w-[480px] p-6 shadow-2xl z-10 border border-outline-variant space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md font-bold text-primary">Edit Data Booking ({editingBooking.poNumber})</h3>
              <button type="button" onClick={() => setEditingBooking(null)} className="text-outline hover:text-on-surface p-1 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface">Nomor Polisi Truk</label>
              <input
                required
                value={editForm.plateNumber}
                onChange={(e) => setEditForm({...editForm, plateNumber: e.target.value})}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg font-code focus:border-secondary focus:outline-none uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface">Nama Pengemudi (Driver)</label>
              <input
                required
                value={editForm.driverName}
                onChange={(e) => setEditForm({...editForm, driverName: e.target.value})}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface">No. Telepon Driver</label>
              <input
                required
                value={editForm.driverPhone}
                onChange={(e) => setEditForm({...editForm, driverPhone: e.target.value})}
                className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <button type="button" onClick={() => setEditingBooking(null)} className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface">Batal</button>
              <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md shadow-sm">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setCancelingBooking(null)}></div>
          <form onSubmit={handleConfirmCancel} className="relative bg-white rounded-xl w-full max-w-[480px] p-6 shadow-2xl z-10 border border-outline-variant space-y-4">
            <h3 className="font-headline-md text-headline-md font-bold text-error">Pembatalan Booking ({cancelingBooking.poNumber})</h3>
            <p className="text-sm text-on-surface-variant">Apakah Anda yakin ingin membatalkan jadwal booking ini?</p>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface">Alasan Pembatalan <span className="text-error">*</span></label>
              <textarea
                required
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Masukkan alasan pembatalan..."
                className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:border-secondary focus:outline-none text-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setCancelingBooking(null)} className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface">Batal</button>
              <button type="submit" className="px-4 py-2 bg-error text-white rounded-lg font-label-md shadow-sm">Batalkan Booking</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

