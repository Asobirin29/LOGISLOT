'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SecurityMainPage() {
  const [time, setTime] = useState<string>('--:--:--');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background text-on-background font-body-lg antialiased flex flex-col h-[calc(100vh-64px)] overflow-hidden w-full relative">
      
      {/* Header (High Contrast Navy) - Internal to this view to match design */}
      <header className="bg-primary-container h-20 w-full flex-shrink-0 flex items-center justify-between px-lg text-on-primary shadow-md z-10 relative">
        <div className="flex items-center gap-md">
          {/* Brand Logo */}
          <span className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-md md:text-headline-md font-bold tracking-tight">LOGISLOT</span>
          <div className="h-6 w-px bg-on-primary opacity-30 mx-2 hidden md:block"></div>
          <span className="font-headline-sm text-headline-sm hidden md:block opacity-90">POS GERBANG - CHECK-IN/OUT</span>
        </div>
        
        <div className="flex items-center gap-lg">
          <div className="text-right flex flex-col">
            <span className="font-code text-code font-bold text-[22px] leading-none tracking-wider">{time}</span>
            <span className="font-label-md text-label-md opacity-80 mt-1 uppercase">Petugas: Budi Santoso</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-secondary-container flex items-center justify-center border-2 border-on-primary">
            <span className="material-symbols-outlined text-on-secondary-container">person</span>
          </div>
        </div>
      </header>
      
      {/* Mobile Sub-Header (Only visible on very small screens) */}
      <div className="bg-primary text-on-primary py-sm px-md text-center md:hidden font-headline-sm text-headline-sm shadow-sm z-0">
          POS GERBANG - CHECK-IN/OUT
      </div>
      
      {/* Main Content Area (Optimized for Tablet Portrait) */}
      <main className="flex-grow flex flex-col justify-center items-center px-lg py-xl relative">
        {/* Large QR Scan Button */}
        <button className="w-[85%] md:w-[70%] max-w-[600px] aspect-square md:aspect-auto md:h-[400px] rounded-2xl bg-gradient-to-br from-primary-container to-secondary shadow-[0_8px_30px_rgb(27,54,93,0.3)] flex flex-col items-center justify-center gap-xl transition-transform active:scale-95 hover:shadow-[0_12px_40px_rgb(27,54,93,0.4)] group relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          
          <div className="relative z-10 bg-on-primary bg-opacity-20 p-xl rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '80px', fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-primary tracking-wide text-center px-lg">
              TAP UNTUK SCAN<br/>QR CODE
            </span>
          </div>
        </button>
        
        {/* Spacer */}
        <div className="h-xl md:h-[60px]"></div>
        
        {/* Manual Input Button */}
        <button className="w-[85%] md:w-[70%] max-w-[600px] h-[80px] rounded-lg border-2 border-primary-container bg-surface-container-lowest text-primary-container flex items-center justify-center gap-md hover:bg-surface-container-low transition-colors active:bg-surface-container">
          <span className="material-symbols-outlined text-[32px]">keyboard</span>
          <span className="font-headline-sm text-headline-sm">Input Manual (Plat Nomor)</span>
        </button>
      </main>
      
      {/* Bottom Status Bar */}
      <div className="w-full bg-surface-container border-t border-outline-variant px-lg py-md flex items-center justify-between z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary">local_shipping</span>
          <span className="font-headline-sm text-headline-sm text-on-surface">Antrian Hari Ini: <strong className="font-bold text-primary">12 truk</strong></span>
        </div>
        <Link href="/security/queue" className="font-headline-sm text-headline-sm text-primary hover:text-primary-container underline flex items-center gap-xs">
          Lihat Daftar
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
      </div>
      
    </div>
  );
}
