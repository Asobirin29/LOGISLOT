'use client';

export default function TimeSlotPage() {
  return (
    <div className="p-lg max-w-container-max mx-auto w-full flex-1">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-lg">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary-container">Pengaturan Jam Operasional & Kuota</h2>
        <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-container transition-colors flex items-center gap-2 active:opacity-80">
          <span className="material-symbols-outlined">add</span>
          Tambah Slot
        </button>
      </div>
      
      {/* Info Box */}
      <div className="bg-surface-container-low border border-secondary-fixed rounded-lg p-md mb-lg flex items-start gap-md">
        <span className="material-symbols-outlined text-secondary mt-1">info</span>
        <div>
          <p className="font-body-md text-body-md text-on-surface">Total kapasitas per hari saat ini: <strong className="text-primary font-bold">120 slot truk</strong> (24 jam operasional x rata-rata 5 kuota)</p>
        </div>
      </div>
      
      {/* Settings Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
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
              
              {/* Row 1 */}
              <tr className="border-b border-outline-variant hover:bg-surface-bright transition-colors">
                <td className="py-4 px-6 font-code">00:00</td>
                <td className="py-4 px-6 font-code">04:00</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <input className="w-16 px-2 py-1 border border-outline-variant rounded text-center focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm" type="number" defaultValue="3" />
                    <button className="text-outline hover:text-secondary transition-colors" title="Edit">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-1 flex-wrap">
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Sen</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Sel</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Rab</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Kam</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Jum</span>
                    <span className="px-2 py-1 border border-outline text-outline rounded text-xs font-medium">Sab</span>
                    <span className="px-2 py-1 border border-outline text-outline rounded text-xs font-medium">Min</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="text-error opacity-70 hover:opacity-100 hover:bg-error-container p-2 rounded-full transition-all" title="Hapus">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
              
              {/* Row 2 */}
              <tr className="border-b border-outline-variant bg-surface-bright hover:bg-surface transition-colors">
                <td className="py-4 px-6 font-code">04:00</td>
                <td className="py-4 px-6 font-code">08:00</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <input className="w-16 px-2 py-1 border border-outline-variant rounded text-center focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm" type="number" defaultValue="5" />
                    <button className="text-outline hover:text-secondary transition-colors" title="Edit">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-1 flex-wrap">
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Sen</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Sel</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Rab</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Kam</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Jum</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Sab</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Min</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="text-error opacity-70 hover:opacity-100 hover:bg-error-container p-2 rounded-full transition-all" title="Hapus">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
              
              {/* Row 3 */}
              <tr className="border-b border-outline-variant hover:bg-surface-bright transition-colors">
                <td className="py-4 px-6 font-code">08:00</td>
                <td className="py-4 px-6 font-code">12:00</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <input className="w-16 px-2 py-1 border border-outline-variant rounded text-center focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm" type="number" defaultValue="8" />
                    <button className="text-outline hover:text-secondary transition-colors" title="Edit">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-1 flex-wrap">
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Sen</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Sel</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Rab</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Kam</span>
                    <span className="px-2 py-1 bg-primary text-on-primary rounded text-xs font-bold">Jum</span>
                    <span className="px-2 py-1 border border-outline text-outline rounded text-xs font-medium">Sab</span>
                    <span className="px-2 py-1 border border-outline text-outline rounded text-xs font-medium">Min</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="text-error opacity-70 hover:opacity-100 hover:bg-error-container p-2 rounded-full transition-all" title="Hapus">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
