'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SecurityManualSearchPage() {
  const [time, setTime] = useState<string>('--:--:--');
  const [nopol, setNopol] = useState('');
  const [showError, setShowError] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const router = useRouter();

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

  const handleSearch = () => {
    if (nopol.trim() === '') {
      setShowError(true);
      setShowResult(false);
    } else {
      setShowError(false);
      setShowResult(true);
    }
  };

  const handleKeyClick = (key: string) => {
    if (key === 'SPACE') {
      setNopol(prev => prev + ' ');
    } else if (key === 'BACKSPACE') {
      setNopol(prev => prev.slice(0, -1));
    } else if (key !== '123' && key !== '. -') {
      setNopol(prev => prev + key);
    }
  };

  const handleCheckIn = () => {
    router.push('/security/success');
  };

  return (
    <div className="bg-background min-h-screen flex flex-col items-center pb-32">
      {/* TopAppBar */}
      <header className="bg-primary flex justify-between items-center px-lg w-full h-20 shadow-md z-10 sticky top-0">
        <div className="flex items-center gap-md">
          <Link href="/security" className="p-2 rounded-full hover:bg-primary-container transition-colors flex items-center justify-center mr-2">
            <span className="material-symbols-outlined text-on-primary">arrow_back</span>
          </Link>
          <span className="font-headline-md text-headline-md font-bold text-on-primary tracking-tight">LOGISLOT</span>
        </div>
        <div className="flex-1 flex justify-center hidden md:flex">
          <span className="font-headline-sm text-headline-sm text-on-primary">POS GERBANG - CHECK-IN/OUT</span>
        </div>
        <div className="flex items-center space-x-md">
          <span className="font-headline-md text-headline-md text-on-primary hidden md:block">{time}</span>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-primary-container">
            <img alt="Officer profile photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI7qLX6f1diq0yegaGyib99vsdJYDvrFLYQeSx8wlMG_eHGAe5s4aVsWscf49LQt1jLitgMO9aWz9ovmMYShmQgv52lKMOY4PBkCMdfLPET4P8QUCQjPPQSspJ_AfRGQTaa7_oXcZFkaUsOUEaW3eIT1eA1B_m50hz8IWWR1xBpIOE27l5j9-9B31Bq7fLC8zzCuzPPwE0dValVtv6DZsT7QSts_KC62Nofv0ztBoJHSuxAZiBErdgOYMQUX1xZsTaQ1JSJUfnsg"/>
          </div>
          <button className="material-symbols-outlined text-on-primary cursor-pointer hover:bg-primary-container transition-colors rounded-full p-2" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_home</button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-container-max mx-auto p-gutter md:p-xl flex flex-col items-center justify-start mt-8 space-y-xl">
        {/* Search Card */}
        <div className="w-full max-w-3xl bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xl text-center">Cari Booking Manual</h1>
          
          <div className="space-y-lg mb-xl">
            <div>
              <label className="block font-headline-sm text-headline-sm text-on-surface-variant mb-sm" htmlFor="nopol">Nomor Polisi Truk</label>
              <input 
                value={nopol}
                onChange={(e) => setNopol(e.target.value)}
                autoComplete="off" 
                className="w-full h-20 px-6 font-headline-lg text-headline-lg text-on-surface border border-outline-variant rounded-lg bg-surface focus:ring-2 focus:ring-secondary focus:border-secondary uppercase placeholder-outline transition-colors shadow-inner" 
                id="nopol" 
                placeholder="Contoh: B 1234 XYZ" 
                type="text"
              />
            </div>
            {/* Error State */}
            {showError && (
              <div className="flex items-center p-md bg-error-container rounded-lg border border-error">
                <span className="material-symbols-outlined text-error mr-sm" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                <span className="font-body-lg text-body-lg text-error">Booking Tidak Ditemukan — Hubungi Security Pengawas</span>
              </div>
            )}
          </div>
          
          {/* Virtual Keyboard */}
          <div className="grid grid-cols-10 gap-sm mb-xl bg-surface p-md rounded-lg border border-outline-variant">
            {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => (
              <button key={key} onClick={() => handleKeyClick(key)} className="h-12 md:h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant">{key}</button>
            ))}
            <button onClick={() => handleKeyClick('A')} className="h-12 md:h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant col-start-2">A</button>
            {['S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => (
              <button key={key} onClick={() => handleKeyClick(key)} className="h-12 md:h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant">{key}</button>
            ))}
            <button onClick={() => handleKeyClick('Z')} className="h-12 md:h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant col-start-3">Z</button>
            {['X', 'C', 'V', 'B', 'N', 'M'].map(key => (
              <button key={key} onClick={() => handleKeyClick(key)} className="h-12 md:h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant">{key}</button>
            ))}
            <button onClick={() => handleKeyClick('BACKSPACE')} className="h-12 md:h-16 bg-surface-variant rounded font-headline-sm text-headline-sm text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant col-span-2 flex items-center justify-center">
              <span className="material-symbols-outlined">backspace</span>
            </button>
            <button className="h-12 md:h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant col-span-2">123</button>
            <button onClick={() => handleKeyClick('SPACE')} className="h-12 md:h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant col-span-6">SPACE</button>
            <button className="h-12 md:h-16 bg-surface-container-highest rounded font-headline-md text-headline-md text-on-surface hover:bg-primary hover:text-on-primary transition-colors active:scale-95 shadow-sm border border-outline-variant col-span-2">. -</button>
          </div>
          
          <button onClick={handleSearch} className="w-full bg-primary-container text-on-primary h-20 rounded-lg font-headline-md text-headline-md shadow-sm hover:bg-primary transition-colors active:scale-[0.99] flex items-center justify-center">
            <span className="material-symbols-outlined mr-sm text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
            Cari
          </button>
        </div>

        {/* Result Card */}
        {showResult && (
          <div className="w-full max-w-3xl bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm flex flex-col space-y-lg animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-md md:space-y-0 md:space-x-xl pb-lg border-b border-outline-variant">
              <div className="w-full md:w-32 h-32 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 overflow-hidden border border-outline-variant">
                <img alt="Truck placeholder" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAYkqxignBpfsyziBlBg_CiftDL2rQfE2yy1E10d6h8oGgvXR3_TogAgAsTpX1mFQVLITIKYCgv_W97RGDsE9hFOqNxy44lVG0E3V0aXgAi8PIVrfMyYjpQB-Y9oB9X8WN5gmwx_D0bqu8uSzg1QMnHuVwnzMlBtczQs-5YOvUZ96kzYRgJ75a2ykXzn2I0C0n12On2z9rz9gkFUBADIAdV6UuEeRf9FJhBl2URxoH5I8Ih2tF6IGLRHHH7sTfaj5VzAgOqG098w"/>
              </div>
              <div className="flex-1">
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-xs">{nopol || 'B 9182 TEQ'}</h2>
                <p className="font-headline-sm text-headline-sm text-secondary mb-md">PT Global Logistik Sejahtera</p>
                <div className="inline-flex items-center px-4 py-2 bg-surface-container-highest rounded-md border border-outline-variant">
                  <span className="material-symbols-outlined text-on-surface-variant mr-sm">schedule</span>
                  <span className="font-body-lg text-body-lg text-on-surface font-semibold">Jam Slot: 10:00 - 11:00</span>
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end justify-center w-full md:w-auto">
                <span className="inline-flex items-center justify-center px-4 py-1 bg-[#E8F5E9] text-[#1B5E20] rounded-full font-label-md text-label-md border border-[#A5D6A7] mb-md">
                  ON TIME
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">Gate: A-01</span>
              </div>
            </div>
            <button onClick={handleCheckIn} className="w-full bg-[#2E7D32] text-white h-20 rounded-lg font-headline-md text-headline-md shadow-sm hover:bg-[#1B5E20] transition-colors active:scale-[0.99] flex items-center justify-center">
              <span className="material-symbols-outlined mr-sm text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Konfirmasi Check-in
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
