'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BookingPage() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <main className="flex-1 overflow-y-auto p-gutter bg-background">
        <div className="max-w-container-max mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Slot Booking</h2>
              <p className="font-body-md text-on-surface-variant mt-1">Select an available dock and time slot for your delivery.</p>
            </div>
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">calendar_today</span>
                24 Okt 2026
              </div>
            </div>
          </div>
          
          {/* Grid/Calendar Placeholder */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
            <div className="h-[600px] bg-surface-container-low rounded-lg border border-outline-variant border-dashed flex items-center justify-center cursor-pointer hover:bg-surface-variant transition-colors" onClick={() => setIsPanelOpen(true)}>
              <span className="font-headline-md text-on-surface-variant opacity-50">Interactive Slot Calendar (Click to open panel)</span>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay / Backdrop */}
      {isPanelOpen && (
        <div 
          aria-hidden="true" 
          className="fixed inset-0 bg-on-background/40 z-40 transition-opacity duration-200"
          onClick={() => setIsPanelOpen(false)}
        ></div>
      )}

      {/* Side-panel / Modal */}
      <aside 
        className={`fixed top-0 right-0 h-screen w-full md:w-[480px] bg-surface-container-lowest shadow-[-8px_0_24px_rgba(27,54,93,0.12)] z-50 flex flex-col overflow-hidden transition-transform duration-300 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="px-gutter py-lg border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest shrink-0">
          <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Detail Pemesanan</h2>
          <button 
            className="w-10 h-10 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setIsPanelOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-gutter space-y-xl custom-scrollbar">
          {/* Info Box */}
          <div className="bg-surface-container rounded-lg p-md border border-outline-variant relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-lg"></div>
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Slot Terpilih</h3>
            <div className="grid grid-cols-2 gap-4 mt-md">
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant">Tanggal</p>
                <p className="font-body-lg text-on-surface font-semibold flex items-center gap-2 mt-xs">
                  <span className="material-symbols-outlined text-secondary text-sm">calendar_month</span>
                  24 Okt 2026
                </p>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant">Waktu</p>
                <p className="font-body-lg text-on-surface font-semibold flex items-center gap-2 mt-xs">
                  <span className="material-symbols-outlined text-secondary text-sm">schedule</span>
                  09:00 - 10:00
                </p>
              </div>
              <div className="col-span-2 pt-2 border-t border-outline-variant/50">
                <p className="font-label-md text-label-md text-on-surface-variant">Lokasi</p>
                <p className="font-body-lg text-on-surface font-semibold flex items-center gap-2 mt-xs">
                  <span className="material-symbols-outlined text-secondary text-sm">warehouse</span>
                  Dock 1 - Main Distribution Center
                </p>
              </div>
            </div>
          </div>
          
          {/* Form Fields */}
          <form className="space-y-6">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="poNumber">Nomor PO <span className="text-error">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">receipt</span>
                </div>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-4 font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" id="poNumber" name="poNumber" placeholder="Masukkan Nomor Purchase Order" required type="text"/>
              </div>
            </div>
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="truckPlate">Plat Nomor Truk <span className="text-error">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">pin</span>
                </div>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-4 font-body-md text-on-surface uppercase focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" id="truckPlate" name="truckPlate" placeholder="B 1234 XYZ" required type="text"/>
              </div>
              <p className="font-label-md text-label-md text-on-surface-variant mt-1 font-normal opacity-80">Format: Area - Nomor - Huruf Belakang</p>
            </div>
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="driverName">Nama Sopir <span className="text-error">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-4 font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" id="driverName" name="driverName" placeholder="Nama Lengkap Sopir" required type="text"/>
              </div>
            </div>
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="vehicleType">Jenis Armada <span className="text-error">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline z-10">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-10 pr-10 font-body-md text-on-surface appearance-none focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors cursor-pointer" id="vehicleType" name="vehicleType" required defaultValue="">
                  <option disabled value="">Pilih Jenis Armada</option>
                  <option value="Truk Box">Truk Box</option>
                  <option value="Truk Engkel">Truk Engkel</option>
                  <option value="Truk Fuso">Truk Fuso</option>
                  <option value="Trailer">Trailer</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">arrow_drop_down</span>
                </div>
              </div>
            </div>
          </form>
          
          {/* Decorative Visual */}
          <div className="mt-lg rounded-xl overflow-hidden h-32 relative border border-outline-variant bg-surface-container-low flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent z-10"></div>
          </div>
        </div>
        
        {/* Footer / Action Area */}
        <div className="p-gutter border-t border-outline-variant bg-surface-container-lowest shrink-0">
          <Link href="/supplier/booking/success" className="w-full bg-primary-container hover:bg-primary text-on-primary font-body-lg font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Konfirmasi Booking
          </Link>
          <p className="font-label-md text-label-md text-center text-on-surface-variant mt-sm font-normal">Pastikan semua data sesuai sebelum konfirmasi.</p>
        </div>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #c4c6cf;
            border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background-color: #74777f;
        }
      `}</style>
    </div>
  );
}
