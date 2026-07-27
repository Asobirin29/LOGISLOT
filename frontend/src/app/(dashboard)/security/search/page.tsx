'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SecuritySearchPage() {
  const [time, setTime] = useState('--:--:--');
  const [searchValue, setSearchValue] = useState('');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false });
      setTime(timeString);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (searchValue.trim()) {
      setShowResult(true);
    }
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-background">
      {/* TopAppBar */}
      <header className="bg-primary flex justify-between items-center px-lg w-full h-20 shadow-md rounded-xl mb-4">
        <div className="flex items-center">
          <Link href="/security" className="p-2 rounded-full hover:bg-primary-container transition-colors flex items-center justify-center mr-2 text-on-primary">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="font-headline-md text-headline-md font-bold text-on-primary tracking-tight">LOGISLOT</span>
        </div>
        <div className="flex-1 flex justify-center hidden sm:flex">
          <span className="font-headline-sm text-headline-sm text-on-primary">POS GERBANG - CHECK-IN/OUT</span>
        </div>
        <div className="flex items-center space-x-md">
          <span className="font-headline-md text-headline-md text-on-primary hidden sm:block">{time}</span>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-primary-container">
            <span className="material-symbols-outlined">person</span>
          </div>
          <span className="material-symbols-outlined text-on-primary cursor-pointer hover:bg-primary-container transition-colors rounded-full p-2">emergency_home</span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-container-max mx-auto p-gutter md:p-xl flex flex-col items-center justify-start mt-4 space-y-xl overflow-auto">
        
        {/* Search Card */}
        <div className="w-full max-w-3xl bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xl text-center">Cari Booking Manual</h1>
          
          <div className="space-y-lg mb-xl">
            <div>
              <label className="block font-headline-sm text-headline-sm text-on-surface-variant mb-sm" htmlFor="nopol">Nomor Polisi Truk</label>
              <input 
                id="nopol" 
                type="text" 
                autoComplete="off" 
                placeholder="Contoh: B 1234 XYZ"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full h-20 px-6 font-headline-lg text-headline-lg text-on-surface border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary uppercase placeholder-outline transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Virtual Keyboard (Simplified visual representation) */}
          <div className="grid grid-cols-10 gap-sm mb-xl bg-surface p-md rounded-lg border border-outline-variant">
            {['Q','W','E','R','T','Y','U','I','O','P'].map(key => (
              <button key={key} className="h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant">{key}</button>
            ))}
            {['A','S','D','F','G','H','J','K','L'].map((key, i) => (
              <button key={key} className={`h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant ${i===0?'col-start-2':''}`}>{key}</button>
            ))}
            {['Z','X','C','V','B','N','M'].map((key, i) => (
              <button key={key} className={`h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant ${i===0?'col-start-3':''}`}>{key}</button>
            ))}
            <button className="h-16 bg-surface-variant rounded font-headline-sm text-headline-sm text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant col-span-2 flex items-center justify-center">
              <span className="material-symbols-outlined">backspace</span>
            </button>
            <button className="h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant col-span-2">123</button>
            <button className="h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant col-span-6">SPACE</button>
            <button className="h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant col-span-2">. -</button>
          </div>
          
          <button 
            onClick={handleSearch}
            className="w-full bg-primary-container text-on-primary h-20 rounded-lg font-headline-md text-headline-md shadow-sm hover:bg-primary transition-colors active:scale-[0.99] flex items-center justify-center"
          >
            <span className="material-symbols-outlined mr-sm text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
            Cari
          </button>
        </div>

        {/* Result Card (Shown after search) */}
        {showResult && (
          <div className="w-full max-w-3xl bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm flex flex-col space-y-lg mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-xl pb-lg border-b border-outline-variant gap-4 sm:gap-0">
              <div className="w-32 h-32 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 overflow-hidden border border-outline-variant">
                <span className="material-symbols-outlined text-[64px] text-primary">local_shipping</span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-xs uppercase">{searchValue || 'B 9182 TEQ'}</h2>
                <p className="font-headline-sm text-headline-sm text-secondary mb-md">PT Global Logistik Sejahtera</p>
                <div className="inline-flex items-center px-4 py-2 bg-surface-container-highest rounded-md border border-outline-variant">
                  <span className="material-symbols-outlined text-on-surface-variant mr-sm">schedule</span>
                  <span className="font-body-lg text-body-lg text-on-surface font-semibold">Jam Slot: 10:00 - 11:00</span>
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-end justify-center">
                <span className="inline-flex items-center justify-center px-4 py-1 bg-[#E8F5E9] text-[#1B5E20] rounded-full font-label-md text-label-md border border-[#A5D6A7] mb-md">
                  ON TIME
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">Gate: A-01</span>
              </div>
            </div>
            <Link href="/security/success" className="w-full bg-[#2E7D32] text-white h-20 rounded-lg font-headline-md text-headline-md shadow-sm hover:bg-[#1B5E20] transition-colors active:scale-[0.99] flex items-center justify-center">
              <span className="material-symbols-outlined mr-sm text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Konfirmasi Check-in
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
