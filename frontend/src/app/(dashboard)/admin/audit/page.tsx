'use client';

export default function AdminAuditLogPage() {
  return (
    <div className="p-lg md:p-xl lg:px-10 flex-1 max-w-[1100px] mx-auto w-full">
      {/* Page Header */}
      <div className="mb-lg">
        <h1 className="font-headline-lg text-headline-lg md:font-headline-lg md:text-headline-lg text-primary-container font-bold mb-xs">Audit Log Sistem</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Riwayat lengkap seluruh aktivitas dan perubahan status di sistem</p>
      </div>
      
      {/* Filter & Action Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md mb-lg flex flex-col md:flex-row gap-md justify-between items-center shadow-sm">
        <div className="flex flex-wrap gap-sm w-full md:w-auto">
          {/* Date Range */}
          <div className="relative flex-1 md:flex-none min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline text-[18px]">date_range</span>
            </div>
            <input className="block w-full pl-10 pr-3 py-sm border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-bright focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" readOnly type="text" defaultValue="Last 7 Days"/>
          </div>
          
          {/* Event Type */}
          <div className="relative flex-1 md:flex-none min-w-[180px]">
            <select className="block w-full pl-3 pr-9 py-sm border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-bright focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none transition-colors">
              <option>Semua Jenis Event</option>
              <option>Booking</option>
              <option>Operasional</option>
              <option>Sistem</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
            </div>
          </div>
          
          {/* User */}
          <div className="relative flex-1 md:flex-none min-w-[180px]">
            <select className="block w-full pl-3 pr-9 py-sm border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-bright focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none transition-colors">
              <option>Semua Pengguna</option>
              <option>Admin</option>
              <option>Security</option>
              <option>Vendor</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-outline">
              <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
            </div>
          </div>
        </div>
        
        {/* Export Action */}
        <button className="w-full md:w-auto flex items-center justify-center gap-xs px-md py-sm border border-secondary text-secondary rounded-lg font-label-md text-label-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors shrink-0 bg-transparent">
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Export CSV</span>
        </button>
      </div>
      
      {/* Audit Log Timeline Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden">
        <div className="p-lg relative">
          {/* Vertical Line (Timeline Backbone) */}
          <div className="absolute left-[28px] md:left-[144px] top-lg bottom-lg w-px bg-outline-variant opacity-50 hidden sm:block"></div>
          
          <div className="space-y-0">
            {/* Log Entry 1 */}
            <div className="group flex flex-col sm:flex-row relative hover:bg-surface-container-low p-sm -mx-sm rounded-lg transition-colors items-start py-md border-b border-outline-variant/30 last:border-0">
              <div className="w-full sm:w-[130px] shrink-0 font-code text-code text-on-surface-variant mb-xs sm:mb-0 sm:pt-[2px]">
                28 Jul 2026<br/><span className="opacity-70 text-[11px]">14:32:07</span>
              </div>
              <div className="hidden sm:flex relative shrink-0 w-8 flex-col items-center justify-start mt-[4px]">
                <div className="w-3 h-3 rounded-full bg-secondary ring-4 ring-surface-container-lowest z-10"></div>
              </div>
              <div className="flex-1 min-w-0 pl-0 sm:pl-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-sm">
                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">login</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md text-on-surface leading-tight">
                        <span className="font-semibold text-primary">Security (Budi Santoso)</span> melakukan check-in untuk truk <span className="font-code text-[12px] bg-surface-container-high px-1 rounded border border-outline-variant">B 1234 XYZ</span> pada Booking <span className="font-semibold text-secondary">#LGS-20260728-0042</span>.
                      </p>
                      <div className="mt-xs text-[11px] text-on-surface-variant flex gap-xs items-center">
                        <span className="material-symbols-outlined text-[12px]">devices</span>
                        <span>IP: 192.168.1.104 (Tablet Gate 1)</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-secondary-container text-on-secondary-container border border-secondary/20">
                      Check-in
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Log Entry 2 */}
            <div className="group flex flex-col sm:flex-row relative hover:bg-surface-container-low p-sm -mx-sm rounded-lg transition-colors items-start py-md border-b border-outline-variant/30 last:border-0">
              <div className="w-full sm:w-[130px] shrink-0 font-code text-code text-on-surface-variant mb-xs sm:mb-0 sm:pt-[2px]">
                28 Jul 2026<br/><span className="opacity-70 text-[11px]">13:45:12</span>
              </div>
              <div className="hidden sm:flex relative shrink-0 w-8 flex-col items-center justify-start mt-[4px]">
                <div className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-surface-container-lowest z-10"></div>
              </div>
              <div className="flex-1 min-w-0 pl-0 sm:pl-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-sm">
                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md text-on-surface leading-tight">
                        <span className="font-semibold text-primary">Vendor (PT Logistik Cepat)</span> membuat booking slot baru untuk tanggal 30 Jul 2026 (08:00 - 10:00).
                      </p>
                      <p className="mt-xs text-xs text-on-surface-variant">Refferensi: PO-99821</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Booking Dibuat
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Log Entry 3 */}
            <div className="group flex flex-col sm:flex-row relative hover:bg-surface-container-low p-sm -mx-sm rounded-lg transition-colors items-start py-md border-b border-outline-variant/30 last:border-0">
              <div className="w-full sm:w-[130px] shrink-0 font-code text-code text-on-surface-variant mb-xs sm:mb-0 sm:pt-[2px]">
                28 Jul 2026<br/><span className="opacity-70 text-[11px]">11:20:00</span>
              </div>
              <div className="hidden sm:flex relative shrink-0 w-8 flex-col items-center justify-start mt-[4px]">
                <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-surface-container-lowest z-10"></div>
              </div>
              <div className="flex-1 min-w-0 pl-0 sm:pl-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-sm">
                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">conveyor_belt</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md text-on-surface leading-tight">
                        <span className="font-semibold text-primary">Operator (Andi)</span> memulai proses bongkar muat untuk <span className="font-semibold text-secondary">#LGS-20260728-0035</span> di Dock A2.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Start Unloading
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Log Entry 4 (Error/Cancel) */}
            <div className="group flex flex-col sm:flex-row relative hover:bg-surface-container-low p-sm -mx-sm rounded-lg transition-colors items-start py-md border-b border-outline-variant/30 last:border-0">
              <div className="w-full sm:w-[130px] shrink-0 font-code text-code text-on-surface-variant mb-xs sm:mb-0 sm:pt-[2px]">
                28 Jul 2026<br/><span className="opacity-70 text-[11px]">09:15:44</span>
              </div>
              <div className="hidden sm:flex relative shrink-0 w-8 flex-col items-center justify-start mt-[4px]">
                <div className="w-3 h-3 rounded-full bg-error ring-4 ring-surface-container-lowest z-10"></div>
              </div>
              <div className="flex-1 min-w-0 pl-0 sm:pl-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-sm">
                  <div className="flex items-start gap-sm">
                    <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                    </div>
                    <div>
                      <p className="font-body-md text-body-md text-on-surface leading-tight">
                        <span className="font-semibold text-primary">System</span> membatalkan booking otomatis <span className="font-semibold text-secondary">#LGS-20260728-0012</span> karena melewati batas waktu toleransi kedatangan (No Show).
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container border border-error/20">
                      Booking Dibatalkan
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Footer Pagination */}
        <div className="px-lg py-md border-t border-outline-variant bg-surface-bright flex flex-col sm:flex-row justify-between items-center gap-md">
          <div className="font-body-md text-[13px] text-on-surface-variant">
            Menampilkan <span className="font-semibold text-on-surface">1-50</span> dari <span className="font-semibold text-on-surface">1,204</span> log
          </div>
          <div className="flex items-center gap-xs">
            <button className="p-xs rounded text-outline hover:bg-surface-container-highest transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded bg-secondary text-on-secondary font-bold text-sm flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded hover:bg-surface-container-highest text-on-surface text-sm flex items-center justify-center transition-colors">2</button>
            <button className="w-8 h-8 rounded hover:bg-surface-container-highest text-on-surface text-sm flex items-center justify-center transition-colors">3</button>
            <span className="px-xs text-on-surface-variant">...</span>
            <button className="w-8 h-8 rounded hover:bg-surface-container-highest text-on-surface text-sm flex items-center justify-center transition-colors">25</button>
            <button className="p-xs rounded text-outline hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
