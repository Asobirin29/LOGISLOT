'use client';

export default function LaporanSLAPage() {
  return (
    <div className="w-full flex-1 flex flex-col p-gutter max-w-container-max mx-auto overflow-y-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-primary-container font-bold mb-2">Laporan Analisis SLA Kedatangan Supplier</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Bandingkan performa ketepatan waktu antar supplier</p>
      </div>

      {/* Control Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 border border-outline-variant rounded-lg px-3 py-2 bg-surface-bright">
            <span className="material-symbols-outlined text-outline">calendar_today</span>
            <span className="font-body-md text-body-md text-on-surface">Periode: 1 Okt 2026 - 31 Okt 2026</span>
          </div>
          <div className="relative">
            <select className="appearance-none bg-surface-bright border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg pl-3 pr-10 py-2 focus:ring-2 focus:ring-secondary focus:border-secondary">
              <option>Semua Supplier</option>
              <option>PT Sumber Baja Persada</option>
              <option>CV Makmur Jaya</option>
              <option>Koperasi Karyawan Sejahtera</option>
              <option>PT Global Logistik Nusantara</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline pointer-events-none">expand_more</span>
          </div>
        </div>
        <button className="flex items-center gap-2 border border-secondary text-secondary hover:bg-surface-container font-label-md text-label-md px-4 py-2 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export ke Excel
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 font-semibold">Perbandingan Ketepatan Waktu per Supplier</h3>
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Supplier 1 */}
              <div>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-2">
                  <span>PT Sumber Baja Persada</span>
                  <span className="font-semibold text-on-surface">85% Tepat Waktu</span>
                </div>
                <div className="h-6 w-full rounded-full flex overflow-hidden">
                  <div className="bg-green-600 h-full w-[85%]"></div>
                  <div className="bg-yellow-400 h-full w-[10%]"></div>
                  <div className="bg-red-600 h-full w-[5%]"></div>
                </div>
              </div>
              {/* Supplier 2 */}
              <div>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-2">
                  <span>CV Makmur Jaya</span>
                  <span className="font-semibold text-on-surface">70% Tepat Waktu</span>
                </div>
                <div className="h-6 w-full rounded-full flex overflow-hidden">
                  <div className="bg-green-600 h-full w-[70%]"></div>
                  <div className="bg-yellow-400 h-full w-[20%]"></div>
                  <div className="bg-red-600 h-full w-[10%]"></div>
                </div>
              </div>
              {/* Supplier 3 */}
              <div>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-2">
                  <span>PT Global Logistik Nusantara</span>
                  <span className="font-semibold text-on-surface">95% Tepat Waktu</span>
                </div>
                <div className="h-6 w-full rounded-full flex overflow-hidden">
                  <div className="bg-green-600 h-full w-[95%]"></div>
                  <div className="bg-yellow-400 h-full w-[3%]"></div>
                  <div className="bg-red-600 h-full w-[2%]"></div>
                </div>
              </div>
              {/* Supplier 4 */}
              <div>
                <div className="flex justify-between font-body-md text-body-md text-on-surface-variant mb-2">
                  <span>Koperasi Karyawan Sejahtera</span>
                  <span className="font-semibold text-on-surface">45% Tepat Waktu</span>
                </div>
                <div className="h-6 w-full rounded-full flex overflow-hidden">
                  <div className="bg-green-600 h-full w-[45%]"></div>
                  <div className="bg-yellow-400 h-full w-[30%]"></div>
                  <div className="bg-red-600 h-full w-[25%]"></div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-4 border-t border-outline-variant">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="font-body-md text-body-md text-on-surface-variant">Tepat Waktu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="font-body-md text-body-md text-on-surface-variant">Terlambat Ringan (&lt; 30m)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span className="font-body-md text-body-md text-on-surface-variant">Terlambat Signifikan (&gt; 30m)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-center">
            <span className="font-body-md text-body-md text-on-surface-variant mb-1">Rata-rata Keterlambatan</span>
            <div className="flex items-end gap-2">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface">14</span>
              <span className="font-body-lg text-body-lg text-on-surface-variant mb-1">Menit</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-center">
            <span className="font-body-md text-body-md text-on-surface-variant mb-2">Supplier Tercepat</span>
            <span className="font-body-lg text-body-lg text-on-surface font-semibold mb-3">PT Global Logistik Nusantara</span>
            <div className="self-start px-3 py-1 bg-[#E6F4EA] border border-[#CEEAD6] rounded-full flex items-center gap-1 text-[#137333]">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span className="font-label-md text-label-md">Performa Top</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-center">
            <span className="font-body-md text-body-md text-on-surface-variant mb-2">Supplier Perlu Perhatian</span>
            <span className="font-body-lg text-body-lg text-on-surface font-semibold mb-3">Koperasi Karyawan Sejahtera</span>
            <div className="self-start px-3 py-1 bg-[#FCE8E6] border border-[#FAD2CF] rounded-full flex items-center gap-1 text-[#C5221F]">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span className="font-label-md text-label-md">SLA Kritis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-outline-variant bg-surface-bright">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Detail Performa Supplier</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-dim font-label-md text-label-md text-on-surface border-b border-outline-variant">
                <th className="p-4 cursor-pointer hover:bg-surface-variant transition-colors group">
                  <div className="flex items-center justify-between">
                    Supplier <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary">arrow_drop_down</span>
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-surface-variant transition-colors group">
                  <div className="flex items-center justify-between">
                    Total Kedatangan <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary">arrow_drop_down</span>
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-surface-variant transition-colors group">
                  <div className="flex items-center justify-between">
                    Tepat Waktu <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary">arrow_drop_down</span>
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-surface-variant transition-colors group">
                  <div className="flex items-center justify-between">
                    Terlambat <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary">arrow_drop_down</span>
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-surface-variant transition-colors group">
                  <div className="flex items-center justify-between">
                    Rata-rata Selisih (menit) <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary">arrow_drop_down</span>
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-surface-variant transition-colors group">
                  <div className="flex items-center justify-between">
                    Skor SLA <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary">arrow_drop_down</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant">
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="p-4 font-semibold">PT Global Logistik Nusantara</td>
                <td className="p-4">120</td>
                <td className="p-4">114</td>
                <td className="p-4">6</td>
                <td className="p-4 text-green-700 font-semibold">+2</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">95%</span>
                </td>
              </tr>
              <tr className="bg-surface-bright hover:bg-surface-container-low transition-colors">
                <td className="p-4 font-semibold">PT Sumber Baja Persada</td>
                <td className="p-4">85</td>
                <td className="p-4">72</td>
                <td className="p-4">13</td>
                <td className="p-4 text-yellow-700 font-semibold">-8</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF7E0] text-[#B06000] border border-[#FDE293]">85%</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="p-4 font-semibold">CV Makmur Jaya</td>
                <td className="p-4">60</td>
                <td className="p-4">42</td>
                <td className="p-4">18</td>
                <td className="p-4 text-red-700 font-semibold">-15</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF7E0] text-[#B06000] border border-[#FDE293]">70%</span>
                </td>
              </tr>
              <tr className="bg-surface-bright hover:bg-surface-container-low transition-colors">
                <td className="p-4 font-semibold">Koperasi Karyawan Sejahtera</td>
                <td className="p-4">40</td>
                <td className="p-4">18</td>
                <td className="p-4">22</td>
                <td className="p-4 text-red-700 font-semibold">-45</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]">45%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
