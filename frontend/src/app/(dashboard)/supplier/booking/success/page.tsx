'use client';

import Link from 'next/link';

export default function BookingSuccessPage() {
  return (
    <div className="flex-1 flex flex-col h-full relative">
      <main className="flex-1 overflow-y-auto p-gutter bg-background opacity-40 blur-sm pointer-events-none">
        <div className="w-full h-full border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center text-outline-variant font-headline-md">
          Background Canvas Context
        </div>
      </main>

      {/* Modal Overlay & Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-background/60 backdrop-blur-sm p-4">
        {/* Modal Card */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_32px_rgba(11,28,48,0.12)] w-full max-w-[420px] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
          
          <div className="p-lg flex flex-col items-center">
            {/* Success Header */}
            <div className="w-16 h-16 rounded-full bg-[#2E7D32] flex items-center justify-center shadow-sm mb-4">
              <span className="material-symbols-outlined text-white text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            </div>
            
            <h2 className="font-headline-sm text-[18px] leading-snug font-bold text-center text-primary mb-6">
              Booking Anda Berhasil Dikonfirmasi!
            </h2>
            
            {/* Ticket Component */}
            <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col relative mb-6">
              {/* Ticket Top (Navy) */}
              <div className="bg-primary-container text-on-primary-container p-4 text-center">
                <span className="font-label-md text-label-md text-inverse-primary/80 uppercase tracking-wider block mb-1">TIKET BOOKING LOGISLOT</span>
                <div className="font-code text-code text-[18px] text-white font-bold tracking-tight">
                  #LGS-20260728-0042
                </div>
              </div>
              
              {/* Ticket Middle (Grid Info) */}
              <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-2 bg-surface-container-lowest relative z-10">
                <div>
                  <span className="block text-[11px] text-outline uppercase font-semibold tracking-wider mb-1">Tanggal</span>
                  <span className="block font-body-md text-[13px] font-semibold text-on-surface">24 Okt 2026</span>
                </div>
                <div>
                  <span className="block text-[11px] text-outline uppercase font-semibold tracking-wider mb-1">Jam Slot</span>
                  <span className="block font-body-md text-[13px] font-semibold text-on-surface">09:00 - 10:00</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[11px] text-outline uppercase font-semibold tracking-wider mb-1">Loading Dock</span>
                  <span className="block font-body-md text-[13px] font-semibold text-on-surface">Dock 1 - Main Distribution Center</span>
                </div>
                <div>
                  <span className="block text-[11px] text-outline uppercase font-semibold tracking-wider mb-1">Plat Nomor</span>
                  <span className="block font-code text-[13px] font-bold text-on-surface">B 1234 XYZ</span>
                </div>
                <div>
                  <span className="block text-[11px] text-outline uppercase font-semibold tracking-wider mb-1">Jenis Armada</span>
                  <span className="block font-body-md text-[13px] font-semibold text-on-surface">Truk Box</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[11px] text-outline uppercase font-semibold tracking-wider mb-1">Nama Sopir</span>
                  <span className="block font-body-md text-[13px] font-semibold text-on-surface">Ahmad Rivai</span>
                </div>
              </div>
              
              {/* Perforation Line */}
              <div className="relative w-full h-8 flex items-center bg-surface-container-lowest z-10">
                <div className="absolute left-[-16px] w-8 h-8 bg-surface-container-low rounded-full shadow-[inset_-2px_0_4px_rgba(0,0,0,0.04)] border-r border-outline-variant"></div>
                <div className="w-full h-px border-b-2 border-dashed border-outline-variant mx-4"></div>
                <div className="absolute right-[-16px] w-8 h-8 bg-surface-container-low rounded-full shadow-[inset_2px_0_4px_rgba(0,0,0,0.04)] border-l border-outline-variant"></div>
              </div>
              
              {/* Ticket Bottom (QR Code) */}
              <div className="p-6 flex flex-col items-center bg-surface-container-lowest relative z-10 rounded-b-xl">
                <div className="w-[160px] h-[160px] bg-white border border-outline-variant p-2 mb-3 rounded-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-[140px] text-on-surface">qr_code_2</span>
                </div>
                <span className="font-code text-[12px] text-on-surface-variant mb-3 tracking-widest bg-surface-container px-2 py-1 rounded">LGS-0042-XYZ</span>
                <p className="text-[12px] text-center text-outline leading-tight max-w-[240px]">
                  Tunjukkan QR Code ini ke Security saat tiba di gerbang pabrik
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3 mb-6">
              <button className="h-11 rounded-lg border-2 border-primary-container text-primary-container font-body-md font-semibold flex items-center justify-center gap-2 hover:bg-surface-container transition-colors focus:ring-2 focus:ring-primary-container focus:ring-offset-2">
                <span className="material-symbols-outlined text-[20px]">download</span>
                Unduh PDF
              </button>
              <button className="h-11 rounded-lg bg-primary-container text-white font-body-md font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>print</span>
                Cetak Tiket
              </button>
            </div>
            
            {/* Footer Action */}
            <Link href="/supplier/booking" className="text-[13px] text-outline font-semibold hover:text-on-surface transition-colors focus:outline-none focus:underline underline-offset-4">
              Tutup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
