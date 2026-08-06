'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SecurityMainPage() {
  const [time, setTime] = useState<string>('--:--:--');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState('PO-20231025-01');
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

  const handleProcessScan = (codeToProcess?: string) => {
    const targetCode = codeToProcess || scannedCode;
    if (targetCode) {
      router.push(`/security/success?po=${encodeURIComponent(targetCode)}`);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-lg antialiased flex flex-col h-[calc(100vh-64px)] overflow-hidden w-full relative">
      
      {/* Header (High Contrast Navy) */}
      <header className="bg-primary-container h-20 w-full flex-shrink-0 flex items-center justify-between px-lg text-on-primary shadow-md z-10 relative">
        <div className="flex items-center gap-md">
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
      
      {/* Mobile Sub-Header */}
      <div className="bg-primary text-on-primary py-sm px-md text-center md:hidden font-headline-sm text-headline-sm shadow-sm z-0">
          POS GERBANG - CHECK-IN/OUT
      </div>
      
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center items-center px-lg py-xl relative">
        {/* Large QR Scan Button */}
        <button 
          data-tour="security-scanner"
          onClick={() => setIsScannerOpen(true)}
          className="w-[85%] md:w-[70%] max-w-[600px] aspect-square md:aspect-auto md:h-[400px] rounded-2xl bg-gradient-to-br from-primary-container to-secondary shadow-[0_8px_30px_rgb(27,54,93,0.3)] flex flex-col items-center justify-center gap-xl transition-transform active:scale-95 hover:shadow-[0_12px_40px_rgb(27,54,93,0.4)] group relative overflow-hidden"
        >
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
        <Link 
          data-tour="security-manual-btn"
          href="/security/manual"
          className="w-[85%] md:w-[70%] max-w-[600px] h-[80px] rounded-lg border-2 border-primary-container bg-surface-container-lowest text-primary-container flex items-center justify-center gap-md hover:bg-surface-container-low transition-colors active:bg-surface-container shadow-sm"
        >
          <span className="material-symbols-outlined text-[32px]">keyboard</span>
          <span className="font-headline-sm text-headline-sm font-bold">Input Manual (Plat Nomor)</span>
        </Link>
      </main>
      
      {/* Bottom Status Bar */}
      <div data-tour="security-queue-bar" className="w-full bg-surface-container border-t border-outline-variant px-lg py-md flex items-center justify-between z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-secondary">local_shipping</span>
          <span className="font-headline-sm text-headline-sm text-on-surface">Antrian Hari Ini: <strong className="font-bold text-primary">12 truk</strong></span>
        </div>
        <Link href="/security/queue" className="font-headline-sm text-headline-sm text-primary hover:text-primary-container underline flex items-center gap-xs">
          Lihat Daftar
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
      </div>

      {/* Interactive QR Scanner Simulation Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/60 backdrop-blur-md" onClick={() => setIsScannerOpen(false)}></div>
          <div className="relative bg-slate-900 text-white rounded-2xl w-full max-w-[480px] p-6 shadow-2xl z-10 border border-slate-700 flex flex-col items-center animate-in fade-in zoom-in-95">
            <div className="w-full flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                <h3 className="font-headline-md text-headline-md font-bold text-white">QR Code Camera Scanner</h3>
              </div>
              <button onClick={() => setIsScannerOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Camera Viewport Simulation */}
            <div className="relative my-6 w-full aspect-square max-w-[320px] bg-slate-950 rounded-xl border-2 border-primary overflow-hidden flex items-center justify-center shadow-inner">
              {/* Laser Scanner Line */}
              <div className="absolute w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] top-1/2 -translate-y-1/2 animate-bounce"></div>

              {/* Viewfinder Corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-emerald-400"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-emerald-400"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-emerald-400"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-emerald-400"></div>

              {/* QR Code graphic */}
              <svg viewBox="0 0 100 100" className="w-40 h-40 opacity-80">
                <rect x="0" y="0" width="100" height="100" fill="transparent" />
                <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" fill="#34d399" />
                <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" fill="#34d399" />
                <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" fill="#34d399" />
                <rect x="45" y="10" width="10" height="10" fill="#34d399" />
                <rect x="45" y="30" width="10" height="20" fill="#34d399" />
                <rect x="60" y="50" width="20" height="10" fill="#34d399" />
                <rect x="50" y="70" width="30" height="20" fill="#34d399" />
              </svg>

              <span className="absolute bottom-3 text-xs font-mono text-emerald-400 bg-slate-900/80 px-2 py-1 rounded">
                Kamera Aktif — Arahkan QR Code Tiket
              </span>
            </div>

            {/* Quick Sample Selector for Demo Testing */}
            <div className="w-full space-y-2 mb-4">
              <label className="block text-xs text-slate-400">Pilih / Input Hasil Scan Tiket:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={() => handleProcessScan()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition-colors text-sm"
                >
                  Proses Check-In
                </button>
              </div>
              <div className="flex gap-2 pt-1">
                {['PO-20231025-01', 'PO-20231025-02', 'PO-20231024-05'].map(code => (
                  <button
                    key={code}
                    onClick={() => {
                      setScannedCode(code);
                      handleProcessScan(code);
                    }}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

