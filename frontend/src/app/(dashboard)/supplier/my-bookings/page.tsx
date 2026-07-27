'use client';

export default function MyBookingsPage() {
  return (
    <main className="flex-1 p-lg max-w-[1440px] w-full mx-auto">
      {/* Page Header */}
      <div className="mb-lg">
        <h1 className="text-[22px] font-bold text-primary-container mb-2">Booking Saya</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Kelola seluruh jadwal pengiriman Anda</p>
      </div>
      
      {/* Filter Bar */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant mb-lg flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Dropdown */}
          <div className="relative min-w-[160px]">
            <select className="w-full appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-4 pr-10 font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cursor-pointer">
              <option>Semua Status</option>
              <option>Booked</option>
              <option>Arrived</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
          </div>
          {/* Date Picker */}
          <div className="relative min-w-[180px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_today</span>
            <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none cursor-pointer" placeholder="Pilih Tanggal" type="text"/>
          </div>
        </div>
        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none" placeholder="Cari PO atau Plat Nomor..." type="text"/>
        </div>
      </div>
      
      {/* Card List */}
      <div className="space-y-[12px] mb-xl">
        {/* Card 1: Booked */}
        <div className="bg-surface-container-lowest rounded-[10px] border border-outline-variant p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-[0_4px_12px_rgba(27,54,93,0.08)] transition-shadow">
          <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
            <div className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md shrink-0 w-24 text-center">
              Booked
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-headline-sm text-headline-sm text-on-surface">PO-20231025-01</span>
                <span className="px-2 py-0.5 bg-surface-container-low border border-outline-variant rounded text-xs font-code text-on-surface-variant">B 1234 CD</span>
              </div>
              <div className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span> 25 Okt 2023
                <span className="w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
                <span className="material-symbols-outlined text-[16px]">schedule</span> 14:00 - 15:00
                <span className="w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
                <span className="material-symbols-outlined text-[16px]">warehouse</span> Dock A1
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/50 w-full sm:w-auto justify-end">
            <button aria-label="Lihat Tiket" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors tooltip-trigger relative group">
              <span className="material-symbols-outlined">visibility</span>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Lihat Tiket</span>
            </button>
            <button aria-label="Edit" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors tooltip-trigger relative group">
              <span className="material-symbols-outlined">edit</span>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Edit</span>
            </button>
            <button aria-label="Batalkan" className="p-2 text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors tooltip-trigger relative group">
              <span className="material-symbols-outlined">close</span>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Batalkan</span>
            </button>
          </div>
        </div>
        
        {/* Card 2: Arrived */}
        <div className="bg-surface-container-lowest rounded-[10px] border border-outline-variant p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-[0_4px_12px_rgba(27,54,93,0.08)] transition-shadow">
          <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
            <div className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md shrink-0 w-24 text-center">
              Arrived
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-headline-sm text-headline-sm text-on-surface">PO-20231025-02</span>
                <span className="px-2 py-0.5 bg-surface-container-low border border-outline-variant rounded text-xs font-code text-on-surface-variant">D 5678 EF</span>
              </div>
              <div className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span> 25 Okt 2023
                <span className="w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
                <span className="material-symbols-outlined text-[16px]">schedule</span> 10:00 - 11:30
                <span className="w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
                <span className="material-symbols-outlined text-[16px]">warehouse</span> Dock B2
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/50 w-full sm:w-auto justify-end">
            <button aria-label="Lihat Tiket" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors tooltip-trigger relative group">
              <span className="material-symbols-outlined">visibility</span>
            </button>
            <button aria-label="Edit" className="p-2 text-on-surface-variant opacity-50 cursor-not-allowed rounded-lg" disabled>
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button aria-label="Batalkan" className="p-2 text-error opacity-50 cursor-not-allowed rounded-lg" disabled>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        
        {/* Card 3: Completed */}
        <div className="bg-surface-bright rounded-[10px] border border-outline-variant p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-[0_4px_12px_rgba(27,54,93,0.08)] transition-shadow">
          <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
            <div className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#137333] font-label-md text-label-md shrink-0 w-24 text-center">
              Completed
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-headline-sm text-headline-sm text-on-surface">PO-20231024-05</span>
                <span className="px-2 py-0.5 bg-surface-container-low border border-outline-variant rounded text-xs font-code text-on-surface-variant">L 9012 GH</span>
              </div>
              <div className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span> 24 Okt 2023
                <span className="w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
                <span className="material-symbols-outlined text-[16px]">schedule</span> 08:00 - 09:00
                <span className="w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
                <span className="material-symbols-outlined text-[16px]">warehouse</span> Dock A2
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/50 w-full sm:w-auto justify-end">
            <button aria-label="Lihat Tiket" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors tooltip-trigger relative group">
              <span className="material-symbols-outlined">visibility</span>
            </button>
          </div>
        </div>
        
        {/* Card 4: Cancelled */}
        <div className="bg-[#F8F9FA] rounded-[10px] border border-outline-variant p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between opacity-75">
          <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
            <div className="px-3 py-1 rounded-full bg-[#F1F3F4] text-[#5F6368] font-label-md text-label-md shrink-0 w-24 text-center border border-outline-variant/50">
              Cancelled
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-headline-sm text-headline-sm text-on-surface line-through decoration-outline-variant">PO-20231026-01</span>
                <span className="px-2 py-0.5 bg-surface-container-low border border-outline-variant rounded text-xs font-code text-on-surface-variant opacity-70">B 4321 XY</span>
              </div>
              <div className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span> 26 Okt 2023
                <span className="w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
                <span className="material-symbols-outlined text-[16px]">schedule</span> 15:00 - 16:30
                <span className="w-1 h-1 rounded-full bg-outline-variant mx-1"></span>
                <span className="material-symbols-outlined text-[16px]">warehouse</span> Dock C1
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/50 w-full sm:w-auto justify-end">
            <button aria-label="Lihat Detail" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors tooltip-trigger relative group">
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-outline-variant pt-4">
        <div className="font-body-md text-body-md text-on-surface-variant hidden sm:block">
          Menampilkan 1-4 dari 42 booking
        </div>
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-label-md text-label-md">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low font-label-md text-label-md transition-colors">
            3
          </button>
          <span className="text-on-surface-variant">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </main>
  );
}
