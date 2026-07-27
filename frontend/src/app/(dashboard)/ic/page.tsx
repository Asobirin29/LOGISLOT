'use client';

export default function ICMonitoringPage() {
  return (
    <div className="w-full flex-1 flex flex-col p-gutter max-w-container-max mx-auto h-full overflow-y-auto bg-[#F4F6F9]">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-xl">
        <div className="flex items-center space-x-3">
          <h2 className="font-headline-lg text-headline-lg text-[#1B365D]">Monitoring Kedatangan Material</h2>
          <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-label-md border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse inline-block"></span>
            Live
          </div>
        </div>
        <div className="text-sm text-outline">Last updated: Just now</div>
      </div>

      {/* Summary Cards (Bento-style row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
        {/* Card 1 */}
        <div className="bg-white p-lg rounded-lg border border-outline-variant flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-outline uppercase mb-1">Total Hari Ini</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">142</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[28px]">local_shipping</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-lg rounded-lg border border-outline-variant flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-outline uppercase mb-1">Sedang di Gerbang</p>
            <p className="font-headline-lg text-headline-lg text-yellow-600">12</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
            <span className="material-symbols-outlined text-[28px]">door_front</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-lg rounded-lg border border-outline-variant flex items-center justify-between">
          <div>
            <p className="font-label-md text-label-md text-outline uppercase mb-1">Sedang Bongkar</p>
            <p className="font-headline-lg text-headline-lg text-secondary">8</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[28px]">inventory_2</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-lg rounded-lg border border-outline-variant flex items-center justify-between relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
          <div>
            <p className="font-label-md text-label-md text-outline uppercase mb-1">Terlambat / Melebihi SLA</p>
            <p className="font-headline-lg text-headline-lg text-error">3</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[28px]">timer_off</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-md rounded-t-lg border border-outline-variant border-b-0 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <select className="appearance-none bg-surface border border-outline-variant text-on-surface font-body-md rounded-lg pl-3 pr-10 py-2 focus:ring-secondary focus:border-secondary h-10">
              <option>Today, 24 Oct</option>
              <option>Yesterday</option>
              <option>This Week</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline pointer-events-none text-[20px]">calendar_month</span>
          </div>
          <div className="relative">
            <select className="appearance-none bg-surface border border-outline-variant text-on-surface font-body-md rounded-lg pl-3 pr-10 py-2 focus:ring-secondary focus:border-secondary h-10 w-48">
              <option>All Status</option>
              <option>Di Gerbang</option>
              <option>Menunggu Dock</option>
              <option>Bongkar</option>
              <option>Selesai</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline pointer-events-none text-[20px]">filter_list</span>
          </div>
        </div>
        <div className="flex items-center bg-surface border border-outline-variant rounded-lg px-3 h-10 w-64 focus-within:border-secondary transition-colors">
          <span className="material-symbols-outlined text-outline mr-2 text-[18px]">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-body-md p-0 w-full placeholder:text-outline text-on-surface outline-none" placeholder="Filter by PO/Supplier..." type="text"/>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-outline-variant rounded-b-lg overflow-hidden flex-1 overflow-y-auto">
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
              {/* Row 1: Urgent / Near SLA */}
              <tr className="even:bg-[#FAFBFC] border-b border-outline-variant hover:bg-surface-container-low transition-colors relative">
                <td className="absolute left-0 top-0 bottom-0 w-1 bg-error"></td>
                <td className="p-4 pl-5 whitespace-nowrap font-code text-code text-primary">PO-2023-8891</td>
                <td className="p-4 whitespace-nowrap font-semibold">PT Sumber Baja Persada</td>
                <td className="p-4 whitespace-nowrap">
                  <div className="inline-flex items-center bg-surface-container border border-outline-variant rounded px-2 py-1 font-code text-code">
                    B 9012 KJL
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">Dock 04</td>
                <td className="p-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>10:00 - 11:30</span>
                    <span className="text-error text-xs font-semibold mt-1 flex items-center"><span className="material-symbols-outlined text-[14px] mr-1">warning</span>+45m Over SLA</span>
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                    Menunggu Dock
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error-container text-error border border-error/30">
                    <span className="material-symbols-outlined text-[14px] mr-1">local_fire_department</span>
                    Urgent
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap text-right">
                  <button className="inline-flex items-center justify-center px-3 py-1.5 border border-outline text-on-surface rounded hover:bg-surface-container transition-colors text-label-md font-label-md">
                    Detail
                  </button>
                </td>
              </tr>
              {/* Row 2: Normal */}
              <tr className="even:bg-[#FAFBFC] border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="p-4 whitespace-nowrap font-code text-code text-primary">PO-2023-8892</td>
                <td className="p-4 whitespace-nowrap font-semibold">CV Makmur Jaya Packing</td>
                <td className="p-4 whitespace-nowrap">
                  <div className="inline-flex items-center bg-surface-container border border-outline-variant rounded px-2 py-1 font-code text-code">
                    D 1455 HGY
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">Dock 01</td>
                <td className="p-4 whitespace-nowrap">10:30 - 11:30</td>
                <td className="p-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                    Sedang Bongkar
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                    Normal
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap text-right">
                  <button className="inline-flex items-center justify-center px-3 py-1.5 border border-outline text-on-surface rounded hover:bg-surface-container transition-colors text-label-md font-label-md">
                    <span className="material-symbols-outlined text-[16px] mr-1 text-error">flag</span>
                    Tandai Urgent
                  </button>
                </td>
              </tr>
              {/* Row 3: Warning near SLA */}
              <tr className="even:bg-[#FAFBFC] border-b border-outline-variant hover:bg-surface-container-low transition-colors relative">
                <td className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></td>
                <td className="p-4 pl-5 whitespace-nowrap font-code text-code text-primary">PO-2023-8895</td>
                <td className="p-4 whitespace-nowrap font-semibold">PT Global Logistik Nusantara</td>
                <td className="p-4 whitespace-nowrap">
                  <div className="inline-flex items-center bg-surface-container border border-outline-variant rounded px-2 py-1 font-code text-code">
                    L 8821 PP
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">Dock 07</td>
                <td className="p-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>11:00 - 12:00</span>
                    <span className="text-yellow-600 text-xs font-semibold mt-1">SLA -10m</span>
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                    Di Gerbang
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                    Normal
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap text-right">
                  <button className="inline-flex items-center justify-center px-3 py-1.5 border border-outline text-on-surface rounded hover:bg-surface-container transition-colors text-label-md font-label-md">
                    <span className="material-symbols-outlined text-[16px] mr-1 text-error">flag</span>
                    Tandai Urgent
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-body-md text-outline">
        <span>Showing 1-4 of 142 arrivals today</span>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface disabled:opacity-50" disabled>&lt;</button>
          <button className="px-3 py-1 border border-secondary bg-secondary-fixed text-secondary font-bold rounded">1</button>
          <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface">2</button>
          <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface">3</button>
          <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface">&gt;</button>
        </div>
      </div>
    </div>
  );
}
