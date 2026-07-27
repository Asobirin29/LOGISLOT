'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SecurityQueuePage() {
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
    <div className="bg-background min-h-screen text-on-background font-body-lg flex flex-col items-center">
      
      {/* TopAppBar */}
      <header className="bg-primary text-on-primary font-headline-md text-headline-md full-width top-0 flat flex justify-between items-center px-lg w-full h-20 shadow-md z-10 sticky">
        <div className="flex items-center gap-md">
          <Link href="/security" className="p-2 rounded-full hover:bg-primary-container transition-colors flex items-center justify-center mr-2">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="font-headline-md text-headline-md font-bold text-on-primary tracking-tight">LOGISLOT</span>
        </div>
        
        <div className="font-headline-md text-headline-md font-bold tracking-tight hidden md:block">
          {time}
        </div>
        
        <div className="flex items-center gap-md">
          <div className="flex items-center gap-sm">
            <img className="w-10 h-10 rounded-full object-cover border-2 border-on-primary" data-alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEuePXBOpF5acGOct1wsh6B1Q8Ocwnl1NMiYI_ff5nmbk1sLWSizT1UptYojkULm-HxAdSrAUanL6n564_3BqjRE8S122BcPAPnmKlJc_u25CgEuYTG4mq15I4HS-9jw8zSyBNDudeGNKwRBgDziKUho2nZf1ImemOG_mCPuqfATNFvIN3SXPgqo4jiOh1Z0B00osKWqrhLvlFXuF5yfqCFIqOqgWv4dSueQ0T0nkTKfbdvFE1zt_Z2CWhVO-ror7KRDt_IfIs5A"/>
          </div>
          <button className="p-2 rounded-full hover:bg-primary-container transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_home</span>
          </button>
        </div>
      </header>
      
      {/* Main Content Canvas */}
      <main className="w-full max-w-container-max px-gutter md:px-lg py-xl flex flex-col gap-lg pb-32">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div className="flex items-center gap-md">
            <h1 className="font-headline-lg text-headline-lg text-on-background tracking-tight">Daftar Truk Diijinkan Masuk Hari Ini</h1>
            <span className="bg-primary text-on-primary font-headline-md text-headline-md rounded-full w-12 h-12 flex items-center justify-center shadow-sm border-2 border-primary-container">12</span>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full shadow-sm bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
          <div className="absolute inset-y-0 left-0 pl-md flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input className="w-full pl-12 pr-md py-4 font-headline-sm text-headline-sm text-on-background bg-transparent border-none focus:ring-0 placeholder:text-outline h-16 outline-none" placeholder="Filter Plat Nomor (Contoh: B 1234 CD)..." type="text"/>
        </div>
        
        {/* Truck List */}
        <div className="flex flex-col gap-sm">
          {/* Warning Card (Late, Not Checked In) */}
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant border-l-8 border-l-error shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch hover:shadow-md transition-shadow cursor-pointer min-h-[100px]">
            {/* Time Badge */}
            <div className="w-full md:w-32 bg-error-container text-on-error-container flex md:flex-col items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant shrink-0 py-2 md:py-0">
              <span className="font-headline-md text-headline-md mr-2 md:mr-0">08:00</span>
              <span className="font-label-md text-label-md mt-0 md:mt-1 uppercase text-error">Terlambat</span>
            </div>
            
            {/* Core Info */}
            <div className="flex-grow flex flex-col justify-center px-lg py-md">
              <div className="font-headline-lg text-headline-lg tracking-tight text-on-background">B 1234 CD</div>
              <div className="font-body-lg text-body-lg text-on-surface-variant mt-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">business</span>
                PT. Logistik Sukses Makmur
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="w-full md:w-48 flex items-center justify-center bg-surface px-md py-4 md:py-0 border-t md:border-t-0 md:border-l border-outline-variant shrink-0">
              <div className="bg-surface-variant text-on-surface-variant px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 border border-outline-variant">
                <span className="material-symbols-outlined text-base">pending</span>
                Belum Tiba
              </div>
            </div>
          </div>
          
          {/* Standard Card (On Time, Checked In) */}
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant border-l-8 border-l-primary shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch hover:shadow-md transition-shadow cursor-pointer min-h-[100px]">
            <div className="w-full md:w-32 bg-surface-container flex md:flex-col items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant shrink-0 py-2 md:py-0">
              <span className="font-headline-md text-headline-md text-on-surface mr-2 md:mr-0">14:30</span>
              <span className="font-label-md text-label-md mt-0 md:mt-1 text-on-surface-variant">SLOT</span>
            </div>
            <div className="flex-grow flex flex-col justify-center px-lg py-md">
              <div className="font-headline-lg text-headline-lg tracking-tight text-on-background">D 5678 EF</div>
              <div className="font-body-lg text-body-lg text-on-surface-variant mt-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">business</span>
                CV. Maju Jaya Trans
              </div>
            </div>
            <div className="w-full md:w-48 flex items-center justify-center bg-surface px-md py-4 md:py-0 border-t md:border-t-0 md:border-l border-outline-variant shrink-0">
              <div className="bg-[#e6f4ea] text-[#137333] px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 border border-[#ceead6]">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Sudah Check-in
              </div>
            </div>
          </div>
          
          {/* Standard Card (Upcoming, Not Checked In) */}
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant border-l-8 border-l-outline-variant shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch hover:shadow-md transition-shadow cursor-pointer min-h-[100px] opacity-80">
            <div className="w-full md:w-32 bg-surface flex md:flex-col items-center justify-center border-b md:border-b-0 md:border-r border-outline-variant shrink-0 py-2 md:py-0">
              <span className="font-headline-md text-headline-md text-outline mr-2 md:mr-0">15:00</span>
              <span className="font-label-md text-label-md mt-0 md:mt-1 text-outline">SLOT</span>
            </div>
            <div className="flex-grow flex flex-col justify-center px-lg py-md">
              <div className="font-headline-lg text-headline-lg tracking-tight text-on-background">L 9012 GH</div>
              <div className="font-body-lg text-body-lg text-on-surface-variant mt-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">business</span>
                Bintang Express Logistics
              </div>
            </div>
            <div className="w-full md:w-48 flex items-center justify-center bg-surface px-md py-4 md:py-0 border-t md:border-t-0 md:border-l border-outline-variant shrink-0">
              <div className="bg-surface-variant text-on-surface-variant px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 border border-outline-variant">
                <span className="material-symbols-outlined text-base">schedule</span>
                Menunggu Tiba
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
