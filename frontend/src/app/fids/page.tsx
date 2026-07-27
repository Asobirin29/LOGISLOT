'use client';

import { useState, useEffect } from 'react';

export default function FIDSPage() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      
      setTime(now.toLocaleTimeString('id-ID', timeOptions));
      
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      
      setDate(`${dayName}, ${day} ${monthName} ${year}`);
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col font-headline-md text-on-surface bg-[#F4F6F9] overflow-hidden">
      {/* Header */}
      <header className="h-[100px] bg-primary-container flex items-center justify-between px-xl shrink-0">
        <div className="flex items-center gap-md">
          <span className="font-headline-lg text-headline-lg font-bold text-on-primary tracking-tight">LOGISLOT</span>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-display text-on-primary tracking-wide font-bold">MONITORING ARMADA REAL-TIME</h1>
        </div>
        
        <div className="flex items-center gap-lg">
          <div className="flex items-center gap-sm bg-surface-tint/30 px-md py-sm rounded-full">
            <div className="w-3 h-3 rounded-full bg-[#22C55E] animate-pulse"></div>
            <span className="font-label-md text-label-md text-on-primary uppercase tracking-widest">Live</span>
          </div>
          <div className="text-right text-on-primary">
            <div className="text-[32px] font-bold leading-tight">{time}</div>
            <div className="text-[18px] text-surface-variant font-medium">{date}</div>
          </div>
        </div>
      </header>

      {/* Summary Bar */}
      <section className="grid grid-cols-4 bg-surface-container-lowest shrink-0 shadow-sm border-b border-outline-variant">
        <div className="p-lg border-b-8 border-primary">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Total Hari Ini</h2>
          <div className="text-display text-on-surface font-bold">142</div>
        </div>
        <div className="p-lg border-b-8 border-[#EAB308] bg-surface">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Di Gerbang</h2>
          <div className="text-display text-[#EAB308] font-bold">18</div>
        </div>
        <div className="p-lg border-b-8 border-[#CA8A04]">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Sedang Bongkar</h2>
          <div className="text-display text-[#CA8A04] font-bold">34</div>
        </div>
        <div className="p-lg border-b-8 border-[#22C55E] bg-surface">
          <h2 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-sm">Selesai</h2>
          <div className="text-display text-[#22C55E] font-bold">90</div>
        </div>
      </section>

      {/* Main Table Area */}
      <main className="flex-1 overflow-hidden relative bg-surface-container-lowest p-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-outline-variant">
              <th className="py-md px-lg font-headline-sm text-headline-sm text-on-surface-variant uppercase">Jam Slot</th>
              <th className="py-md px-lg font-headline-sm text-headline-sm text-on-surface-variant uppercase">Plat Nomor</th>
              <th className="py-md px-lg font-headline-sm text-headline-sm text-on-surface-variant uppercase">Supplier</th>
              <th className="py-md px-lg font-headline-sm text-headline-sm text-on-surface-variant uppercase">Dock Tujuan</th>
              <th className="py-md px-lg font-headline-sm text-headline-sm text-on-surface-variant uppercase">Status</th>
              <th className="py-md px-lg font-headline-sm text-headline-sm text-on-surface-variant uppercase">Durasi / Waktu Tunggu</th>
            </tr>
          </thead>
          <tbody className="text-[24px] font-semibold leading-[32px]">
            {/* Normal Row */}
            <tr className="border-b border-outline-variant bg-surface">
              <td className="py-lg px-lg font-code font-normal">14:00 - 15:00</td>
              <td className="py-lg px-lg font-bold">B 9123 XZ</td>
              <td className="py-lg px-lg">PT. Global Logistik Prima</td>
              <td className="py-lg px-lg font-code font-bold">DOCK-04</td>
              <td className="py-lg px-lg">
                <span className="inline-flex items-center gap-sm bg-[#CA8A04] text-white px-md py-sm rounded-full text-[18px]">
                  <span className="material-symbols-outlined text-[20px]">forklift</span>
                  Sedang Bongkar
                </span>
              </td>
              <td className="py-lg px-lg font-code font-normal">00:25:12</td>
            </tr>
            {/* Alert Row */}
            <tr className="border-b border-outline-variant bg-[#FDECEA]">
              <td className="py-lg px-lg font-code font-normal">13:30 - 14:30</td>
              <td className="py-lg px-lg font-bold text-error">D 8842 KKL</td>
              <td className="py-lg px-lg">CV. Makmur Jaya</td>
              <td className="py-lg px-lg font-code font-bold">DOCK-01</td>
              <td className="py-lg px-lg">
                <span className="inline-flex items-center gap-sm bg-error text-white px-md py-sm rounded-full text-[18px]">
                  <span className="material-symbols-outlined text-[20px] animate-pulse">warning</span>
                  Terlambat &gt;30 menit
                </span>
              </td>
              <td className="py-lg px-lg font-code text-error font-bold">01:15:00</td>
            </tr>
            {/* Normal Row */}
            <tr className="border-b border-outline-variant bg-surface-container-lowest">
              <td className="py-lg px-lg font-code font-normal">14:30 - 15:30</td>
              <td className="py-lg px-lg font-bold">L 1290 HH</td>
              <td className="py-lg px-lg">Samudera Indonesia</td>
              <td className="py-lg px-lg font-code font-bold">DOCK-08</td>
              <td className="py-lg px-lg">
                <span className="inline-flex items-center gap-sm bg-[#EAB308] text-white px-md py-sm rounded-full text-[18px]">
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  Di Gerbang
                </span>
              </td>
              <td className="py-lg px-lg font-code font-normal">00:05:30 (Menunggu)</td>
            </tr>
            {/* Normal Row */}
            <tr className="border-b border-outline-variant bg-surface">
              <td className="py-lg px-lg font-code font-normal">15:00 - 16:00</td>
              <td className="py-lg px-lg font-bold">B 7765 TY</td>
              <td className="py-lg px-lg">Kargo Tech</td>
              <td className="py-lg px-lg font-code font-bold">DOCK-12</td>
              <td className="py-lg px-lg">
                <span className="inline-flex items-center gap-sm bg-[#356289] text-white px-md py-sm rounded-full text-[18px]">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                  Booked
                </span>
              </td>
              <td className="py-lg px-lg font-code text-surface-variant font-normal">-</td>
            </tr>
            {/* Normal Row */}
            <tr className="border-b border-outline-variant bg-surface-container-lowest">
              <td className="py-lg px-lg font-code font-normal">13:00 - 14:00</td>
              <td className="py-lg px-lg font-bold">A 4432 DD</td>
              <td className="py-lg px-lg">Siba Surya</td>
              <td className="py-lg px-lg font-code font-bold">DOCK-02</td>
              <td className="py-lg px-lg">
                <span className="inline-flex items-center gap-sm bg-[#22C55E] text-white px-md py-sm rounded-full text-[18px]">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Selesai
                </span>
              </td>
              <td className="py-lg px-lg font-code font-normal">Selesai 14:10</td>
            </tr>
          </tbody>
        </table>

        {/* Auto-scroll indicator */}
        <div className="absolute right-lg bottom-xl flex flex-col items-center gap-xs text-on-surface-variant opacity-50">
          <span className="font-label-md text-label-md uppercase">Auto Scroll</span>
          <span className="material-symbols-outlined text-[32px] animate-bounce">keyboard_double_arrow_down</span>
        </div>
      </main>
    </div>
  );
}
