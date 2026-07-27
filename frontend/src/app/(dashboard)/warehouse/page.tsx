'use client';

import { useState } from 'react';

export default function WarehouseDashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full flex-1 flex flex-col gap-lg pb-lg">
      <header className="flex justify-between items-center w-full max-w-[1440px] mx-auto">
        <h2 className="font-headline-lg text-headline-lg text-primary font-bold">Denah Loading Dock — Real-Time</h2>
        <button className="bg-surface-container-lowest border border-secondary text-secondary hover:bg-surface-container-low transition-colors px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Kelola Status Dock
        </button>
      </header>

      {/* Bento Grid for Docks */}
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        
        {/* Dock 1 (Tersedia) */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant relative overflow-hidden flex flex-col justify-between h-64">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#2E7D32]"></div>
          <div className="p-md flex justify-between items-start">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Dock 1</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Raw Material</p>
            </div>
            <span className="bg-[#E8F5E9] text-[#2E7D32] px-sm py-xs rounded-full font-label-md text-label-md font-bold">Tersedia</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[48px] mb-sm opacity-50">door_sliding</span>
            <p className="font-label-md text-label-md">Menunggu Truk</p>
          </div>
          <div className="p-md mt-auto">
            <button className="w-full bg-primary text-on-primary py-sm rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors">Panggil Truk</button>
          </div>
        </div>

        {/* Dock 2 (Sedang Bongkar) */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant relative overflow-hidden flex flex-col justify-between h-64 shadow-[0_4px_12px_rgba(27,54,93,0.08)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#F9A825]"></div>
          <div className="p-md pb-xs flex justify-between items-start">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Dock 2</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Packaging</p>
            </div>
            <span className="bg-[#FFFDE7] text-[#F9A825] px-sm py-xs rounded-full font-label-md text-label-md font-bold">Bongkar</span>
          </div>
          <div className="px-md flex flex-col gap-sm mt-sm">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-outline text-[20px]">local_shipping</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">B 9876 XYZ</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">PT. Kemas Maju</p>
            <div className="mt-xs">
              <div className="flex justify-between font-label-md text-label-md mb-xs">
                <span className="text-on-surface-variant flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">timer</span> Sudah 45 menit</span>
                <span className="text-secondary font-bold">60%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-[#F9A825] h-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          <div className="p-md mt-auto">
            <button onClick={() => setIsModalOpen(true)} className="w-full bg-surface-container-lowest border border-secondary text-secondary py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors">Selesai Bongkar</button>
          </div>
        </div>

        {/* Dock 3 (Overstay) */}
        <div className="bg-[#FFEBEE] rounded-xl border-2 border-[#C62828] relative overflow-hidden flex flex-col justify-between h-64 shadow-[0_4px_12px_rgba(198,40,40,0.15)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#C62828]"></div>
          <div className="p-md pb-xs flex justify-between items-start">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Dock 3</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Spare Parts</p>
            </div>
            <span className="bg-[#C62828] text-white px-sm py-xs rounded-full font-label-md text-label-md font-bold flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">warning</span> Overstay!
            </span>
          </div>
          <div className="px-md flex flex-col gap-sm mt-sm">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-outline text-[20px]">local_shipping</span>
              <span className="font-headline-sm text-headline-sm text-on-surface">L 1234 ABC</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">Global Parts Inc.</p>
            <div className="mt-xs">
              <div className="flex font-label-md text-label-md mb-xs text-[#C62828] font-bold items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">timer</span> Sudah 105 menit (Batas: 60m)
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-[#C62828] h-full w-full"></div>
              </div>
            </div>
          </div>
          <div className="p-md mt-auto">
            <button className="w-full bg-[#C62828] text-white py-sm rounded-lg font-label-md text-label-md hover:bg-[#B71C1C] transition-colors">Selesai Bongkar (Force)</button>
          </div>
        </div>

        {/* Dock 4 (Maintenance) */}
        <div className="bg-surface-variant rounded-xl border border-outline-variant relative overflow-hidden flex flex-col justify-between h-64 opacity-75">
          <div className="absolute top-0 left-0 w-full h-1 bg-outline"></div>
          <div className="p-md flex justify-between items-start">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-outline">Dock 4</h3>
              <p className="font-body-md text-body-md text-outline">Chemicals</p>
            </div>
            <span className="bg-surface-container-highest text-outline px-sm py-xs rounded-full font-label-md text-label-md font-bold">Maintenance</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-outline">
            <span className="material-symbols-outlined text-[48px] mb-sm">build</span>
            <p className="font-label-md text-label-md font-bold">Dalam Perbaikan</p>
            <p className="font-body-md text-body-md text-[12px] mt-xs">Estimasi: 2 Hari</p>
          </div>
          <div className="p-md mt-auto pointer-events-none opacity-0">
            <button className="w-full bg-primary text-on-primary py-sm rounded-lg">Hidden</button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Antrian Menunggu Dock */}
      <div className="w-full max-w-[1440px] mx-auto mt-lg bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-md">Antrian Menunggu Dock</h3>
        
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-md pb-xs snap-x">
          
          {/* Queue Item 1 */}
          <div className="min-w-[280px] border border-outline-variant rounded-lg p-md bg-background flex flex-col gap-sm snap-start">
            <div className="flex justify-between items-center">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">D 4567 EF</span>
              <span className="bg-secondary-container text-on-secondary-container text-[11px] px-2 py-1 rounded font-bold">Menunggu 12 menit</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">PT. Distribusi Lancar - Raw Material</p>
            <button className="mt-sm flex items-center justify-center gap-xs w-full bg-surface-container-lowest border border-outline text-on-surface py-1 rounded text-sm hover:bg-surface-container-low transition-colors">
              Pilih Dock <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
            </button>
          </div>

          {/* Queue Item 2 */}
          <div className="min-w-[280px] border border-outline-variant rounded-lg p-md bg-background flex flex-col gap-sm snap-start">
            <div className="flex justify-between items-center">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">B 1122 QQ</span>
              <span className="bg-[#FFFDE7] text-[#F9A825] text-[11px] px-2 py-1 rounded font-bold">Menunggu 25 menit</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">Logistik Utama - Packaging</p>
            <button className="mt-sm flex items-center justify-center gap-xs w-full bg-surface-container-lowest border border-outline text-on-surface py-1 rounded text-sm hover:bg-surface-container-low transition-colors">
              Pilih Dock <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
            </button>
          </div>

          {/* Queue Item 3 */}
          <div className="min-w-[280px] border border-outline-variant rounded-lg p-md bg-background flex flex-col gap-sm snap-start">
            <div className="flex justify-between items-center">
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface">A 9988 ZA</span>
              <span className="bg-[#FFEBEE] text-[#C62828] text-[11px] px-2 py-1 rounded font-bold">Menunggu 40 menit</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">Bina Karya - Spare Parts</p>
            <button className="mt-sm flex items-center justify-center gap-xs w-full bg-surface-container-lowest border border-outline text-on-surface py-1 rounded text-sm hover:bg-surface-container-low transition-colors">
              Pilih Dock <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
            </button>
          </div>

        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-md">
          <div className="bg-surface-container-lowest w-full max-w-[460px] rounded-xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-lg border-b border-outline-variant flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
              </div>
              <h2 className="text-[18px] font-bold text-on-surface">Verifikasi Penerimaan Barang</h2>
            </div>
            
            <div className="p-lg overflow-y-auto max-h-[70vh] flex flex-col gap-lg">
              <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant grid grid-cols-2 gap-y-sm gap-x-md">
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Plat Nomor</p>
                  <p className="text-body-md font-semibold text-on-surface">B 9876 XYZ</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Dock</p>
                  <p className="text-body-md font-semibold text-on-surface">Dock 2</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Supplier</p>
                  <p className="text-body-md font-semibold text-on-surface">PT. Kemas Maju</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Durasi Bongkar</p>
                  <p className="text-body-md font-semibold text-on-surface">1 jam 12 menit</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-sm">
                <label className="text-label-md text-on-surface-variant">Kuantitas Diterima Sesuai PO?</label>
                <div className="grid grid-cols-2 gap-sm">
                  <button className="flex flex-col items-center gap-xs p-md border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all">
                    <span className="material-symbols-outlined text-[#2E7D32]">check_circle</span>
                    <span className="text-label-md font-bold">Ya, Sesuai</span>
                  </button>
                  <button className="flex flex-col items-center gap-xs p-md border-2 border-primary bg-surface-container-low rounded-lg transition-all">
                    <span className="material-symbols-outlined text-[#C62828]">error</span>
                    <span className="text-label-md font-bold">Tidak Sesuai</span>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col gap-xs">
                <label className="text-label-md text-on-surface-variant">Catatan Ketidaksesuaian</label>
                <textarea className="w-full p-md border border-outline-variant rounded-lg bg-surface text-body-md focus:ring-2 focus:ring-primary outline-none min-h-[80px]" placeholder="Jelaskan selisih jumlah atau kondisi barang..."></textarea>
              </div>
              
              <div className="flex flex-col gap-xs">
                <label className="text-label-md text-on-surface-variant">Catatan Tambahan (opsional)</label>
                <textarea className="w-full p-md border border-outline-variant rounded-lg bg-surface text-body-md focus:ring-2 focus:ring-primary outline-none min-h-[60px]" placeholder="Tambahkan catatan jika ada..."></textarea>
              </div>
              
              <div className="flex flex-col gap-xs">
                <label className="text-label-md text-on-surface-variant">Photo Bukti (opsional)</label>
                <div className="border-2 border-dashed border-outline-variant rounded-lg p-lg flex flex-col items-center justify-center gap-xs text-outline hover:bg-surface-container-low transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
                  <span className="text-label-md">Tambah Foto Bukti</span>
                </div>
              </div>
            </div>
            
            <div className="p-lg border-t border-outline-variant flex gap-md">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-sm border border-outline text-on-surface-variant rounded-lg font-label-md hover:bg-surface-container-low transition-colors">Batal</button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-sm bg-primary-container text-on-primary rounded-lg font-label-md hover:bg-primary transition-colors">Konfirmasi Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
