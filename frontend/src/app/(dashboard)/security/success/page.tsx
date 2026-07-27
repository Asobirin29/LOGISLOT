'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SecuritySuccessPage() {
  const router = useRouter();

  return (
    <div className="bg-[#2E7D32] text-white min-h-screen w-full flex flex-col justify-center items-center p-md lg:p-xl selection:bg-surface selection:text-[#2E7D32]">
      <div className="w-full max-w-2xl flex flex-col items-center">
        
        {/* Success Icon */}
        <div className="mb-lg animate-bounce">
          <span className="material-symbols-outlined text-[120px] text-white leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        
        {/* Main Headline */}
        <h1 className="font-headline-lg text-headline-lg text-center mb-xl tracking-tight">CHECK-IN BERHASIL</h1>
        
        {/* Details Card */}
        <div className="bg-surface text-on-surface w-full rounded-xl p-lg lg:p-xl shadow-lg border-2 border-surface-container-high flex flex-col gap-lg">
          
          {/* License Plate - Emphasized */}
          <div className="text-center pb-md border-b border-outline-variant">
            <span className="font-label-md text-label-md text-outline block mb-xs uppercase tracking-widest">Plat Nomor</span>
            <span className="font-headline-lg text-headline-lg text-primary block leading-none font-bold">B 9182 TEQ</span>
          </div>
          
          {/* Supplier */}
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-outline text-2xl">factory</span>
            <div>
              <span className="font-label-md text-label-md text-outline block">Nama Supplier</span>
              <span className="font-headline-sm text-headline-sm text-on-surface block font-semibold">PT. Global Logistik Sejahtera</span>
            </div>
          </div>
          
          {/* Time Comparison */}
          <div className="grid grid-cols-2 gap-md bg-surface-container-low p-md rounded-lg">
            <div className="border-r border-outline-variant">
              <span className="font-label-md text-label-md text-outline block">Jadwal</span>
              <span className="font-headline-sm text-headline-sm text-on-surface block font-semibold">10:00</span>
            </div>
            <div className="pl-md">
              <span className="font-label-md text-label-md text-outline block">Aktual</span>
              <div className="flex items-center gap-xs">
                <span className="font-headline-sm text-headline-sm text-[#2E7D32] block font-semibold">09:45</span>
                <span className="material-symbols-outlined text-[#2E7D32] text-sm">timer</span>
              </div>
            </div>
          </div>
          
          {/* Driver */}
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-outline text-2xl">badge</span>
            <div>
              <span className="font-label-md text-label-md text-outline block">Nama Sopir</span>
              <span className="font-body-lg text-body-lg text-on-surface block font-medium">Budi Santoso</span>
            </div>
          </div>
          
        </div>
        
        {/* Action Button */}
        <button onClick={() => router.push('/security')} className="mt-xl w-full max-w-md border-4 border-white rounded-lg py-md px-lg font-headline-sm text-headline-sm text-white bg-transparent hover:bg-white hover:text-[#2E7D32] transition-colors duration-200 flex items-center justify-center gap-sm uppercase tracking-wide">
          <span className="material-symbols-outlined">barcode_scanner</span>
          Scan Truk Berikutnya
        </button>
        
      </div>
    </div>
  );
}
