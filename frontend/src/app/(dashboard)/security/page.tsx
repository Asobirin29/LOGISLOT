'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SecurityMainPage() {
  const [time, setTime] = useState<string>('--:--:--');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState('PO-20231025-01');
  const [cameraState, setCameraState] = useState<'loading' | 'active' | 'error'>('loading');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraMode, setCameraMode] = useState<'environment' | 'user'>('environment');
  const [camerasList, setCamerasList] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const html5QrRef = useRef<any>(null);
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

  // Initialize camera scanner when modal opens or camera selection changes
  useEffect(() => {
    if (!isScannerOpen) return;

    let isMounted = true;

    const startCamera = async () => {
      try {
        setCameraState('loading');
        setCameraError(null);

        // Safely stop & clear any existing scanner instance first
        if (html5QrRef.current) {
          try {
            if (html5QrRef.current.isScanning) {
              await html5QrRef.current.stop();
            }
            await html5QrRef.current.clear();
          } catch (e) {
            // Ignore cleanup error
          }
          html5QrRef.current = null;
        }

        const { Html5Qrcode } = await import('html5-qrcode');
        if (!isMounted) return;

        const elementId = 'security-qr-reader';
        const el = document.getElementById(elementId);
        if (!el) return;

        const qrConfig = {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        };

        const onScanSuccess = (decodedText: string) => {
          let code = decodedText;
          try {
            const parsed = JSON.parse(decodedText);
            if (parsed.kode_qr) code = parsed.kode_qr;
            else if (parsed.po) code = parsed.po;
          } catch {}

          setScannedCode(code);
          handleProcessScan(code);
        };

        // Determine target camera configuration
        let targetConfig: any = { facingMode: cameraMode };

        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0 && isMounted) {
            setCamerasList(devices.map(d => ({ id: d.id, label: d.label })));

            if (selectedCameraId) {
              targetConfig = selectedCameraId;
            } else {
              const backCam = devices.find((d: any) =>
                d.label.toLowerCase().includes('back') ||
                d.label.toLowerCase().includes('rear') ||
                d.label.toLowerCase().includes('belakang') ||
                d.label.toLowerCase().includes('environment')
              );
              const userCam = devices.find((d: any) =>
                d.label.toLowerCase().includes('front') ||
                d.label.toLowerCase().includes('user') ||
                d.label.toLowerCase().includes('depan')
              );

              if (cameraMode === 'environment' && backCam) {
                targetConfig = backCam.id;
              } else if (cameraMode === 'user' && userCam) {
                targetConfig = userCam.id;
              } else {
                targetConfig = devices[0].id;
              }
            }
          }
        } catch (e) {
          console.warn('Enumerate cameras fallback:', e);
        }

        // Helper function to create and start a scanner instance safely
        const tryStart = async (configToUse: any): Promise<boolean> => {
          try {
            const scanner = new Html5Qrcode(elementId);
            html5QrRef.current = scanner;
            await scanner.start(configToUse, qrConfig, onScanSuccess, () => {});
            return true;
          } catch (err: any) {
            console.warn('Camera start attempt failed:', err);
            if (html5QrRef.current) {
              try {
                if (html5QrRef.current.isScanning) {
                  await html5QrRef.current.stop();
                }
                await html5QrRef.current.clear();
              } catch {}
              html5QrRef.current = null;
            }
            return false;
          }
        };

        // Attempt 1: Target camera
        let success = await tryStart(targetConfig);

        // Attempt 2: Fallback to requested cameraMode constraint
        if (!success && isMounted) {
          await new Promise(r => setTimeout(r, 250));
          success = await tryStart({ facingMode: cameraMode });
        }

        // Attempt 3: Fallback to opposite cameraMode
        if (!success && isMounted) {
          await new Promise(r => setTimeout(r, 250));
          const altMode = cameraMode === 'environment' ? 'user' : 'environment';
          success = await tryStart({ facingMode: altMode });
        }

        if (isMounted) {
          if (success) {
            setCameraState('active');
          } else {
            setCameraState('error');
            setCameraError('Kamera tidak dapat diakses (sedang digunakan oleh aplikasi/tab lain atau izin ditolak).');
          }
        }
      } catch (e: any) {
        console.error('Scanner init error:', e);
        if (isMounted) {
          setCameraState('error');
          setCameraError('Gagal memuat modul kamera.');
        }
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      if (html5QrRef.current) {
        const instance = html5QrRef.current;
        html5QrRef.current = null;
        if (instance.isScanning) {
          instance.stop().then(() => {
            instance.clear();
          }).catch((e: any) => console.warn('Stop scanner error:', e));
        } else {
          try {
            instance.clear();
          } catch {}
        }
      }
    };
  }, [isScannerOpen, cameraMode, selectedCameraId]);

  const handleProcessScan = (codeToProcess?: string) => {
    const targetCode = codeToProcess || scannedCode;
    if (targetCode) {
      router.push(`/security/success?po=${encodeURIComponent(targetCode)}`);
    }
  };

  const handleSwitchCamera = () => {
    if (camerasList.length > 1) {
      const currentIndex = selectedCameraId
        ? camerasList.findIndex(c => c.id === selectedCameraId)
        : 0;
      const nextIndex = (currentIndex + 1) % camerasList.length;
      const nextCam = camerasList[nextIndex];
      setSelectedCameraId(nextCam.id);
      const isBack = nextCam.label.toLowerCase().includes('back') || nextCam.label.toLowerCase().includes('rear') || nextCam.label.toLowerCase().includes('belakang');
      setCameraMode(isBack ? 'environment' : 'user');
    } else {
      const nextMode = cameraMode === 'environment' ? 'user' : 'environment';
      setCameraMode(nextMode);
      setSelectedCameraId(null);
    }
  };

  const handleRetryCamera = () => {
    setIsScannerOpen(false);
    setTimeout(() => {
      setIsScannerOpen(true);
    }, 300);
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

      {/* Interactive QR Camera Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/60 backdrop-blur-md" onClick={() => setIsScannerOpen(false)}></div>
          <div className="relative bg-slate-900 text-white rounded-2xl w-full max-w-[480px] p-6 shadow-2xl z-10 border border-slate-700 flex flex-col items-center animate-in fade-in zoom-in-95">
            <div className="w-full flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${cameraState === 'active' ? 'bg-emerald-500 animate-ping' : cameraState === 'loading' ? 'bg-amber-400 animate-pulse' : 'bg-red-500'}`}></span>
                <h3 className="font-headline-md text-headline-md font-bold text-white text-base md:text-lg">QR Camera Scanner</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Camera Switch Toggle (Front / Back Camera) */}
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  title="Ganti Kamera Depan / Belakang"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-emerald-400 border border-slate-700 text-xs font-medium transition-all"
                >
                  <span className="material-symbols-outlined text-sm">cameraswitch</span>
                  <span>{cameraMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'}</span>
                </button>

                <button onClick={() => setIsScannerOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-full">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Camera Viewport Container */}
            <div className="relative my-6 w-full aspect-square max-w-[320px] bg-slate-950 rounded-xl border-2 border-emerald-500/80 overflow-hidden flex items-center justify-center shadow-inner">
              
              {/* HTML5 QR Code Scanner mounts video here */}
              <div id="security-qr-reader" className="w-full h-full object-cover text-xs overflow-hidden" />

              {/* Viewfinder Overlays & Loading / Error States */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10">
                {/* Laser Scanner Line */}
                <div className="absolute w-full h-0.5 bg-emerald-400 shadow-[0_0_15px_#34d399] top-1/2 -translate-y-1/2 animate-pulse"></div>

                {/* Viewfinder Corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br"></div>

                {/* Switch Camera Overlay Button (Floating in Viewport Top-Right) */}
                <div className="absolute top-3 right-3 pointer-events-auto z-20">
                  <button
                    type="button"
                    onClick={handleSwitchCamera}
                    title="Beralih Kamera Depan/Belakang"
                    className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-md backdrop-blur-sm transition-transform active:scale-90 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-lg">flip_camera_ios</span>
                  </button>
                </div>

                {/* Loading State Overlay */}
                {cameraState === 'loading' && (
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-slate-300 gap-2">
                    <span className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
                    <span className="text-xs font-medium">Membuka Kamera...</span>
                  </div>
                )}

                {/* Error State Overlay */}
                {cameraState === 'error' && (
                  <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center text-slate-300 p-4 text-center gap-2 pointer-events-auto z-30">
                    <span className="material-symbols-outlined text-amber-400 text-3xl">videocam_off</span>
                    <span className="text-xs text-amber-200 font-semibold max-w-[260px]">{cameraError || 'Kamera Tidak Tersedia'}</span>
                    <button
                      onClick={handleRetryCamera}
                      className="mt-1 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">refresh</span>
                      Coba Lagi Kamera
                    </button>
                    <span className="text-[11px] text-slate-400 mt-1">Atau gunakan input manual / sampel tiket di bawah</span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <span className="absolute bottom-3 text-[11px] font-mono text-emerald-400 bg-slate-900/90 px-2.5 py-1 rounded-md z-20 pointer-events-none flex items-center gap-1.5 border border-slate-800 shadow-sm">
                <span className={`w-2 h-2 rounded-full ${cameraState === 'active' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                {cameraState === 'active' ? 'Kamera Aktif — Arahkan QR Code' : cameraState === 'loading' ? 'Menghubungkan Kamera...' : 'Kamera Nonaktif'}
              </span>
            </div>

            {/* Manual Input / Quick Sample Selector */}
            <div className="w-full space-y-2 mb-2">
              <label className="block text-xs text-slate-400">Atau Pilih / Input Hasil Scan Tiket:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  placeholder="Input Kode PO..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={() => handleProcessScan()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition-colors text-sm"
                >
                  Proses Check-In
                </button>
              </div>
              <div className="flex gap-2 pt-1 flex-wrap">
                {['PO-20231025-01', 'PO-20231025-02', 'PO-20231024-05'].map(code => (
                  <button
                    key={code}
                    onClick={() => {
                      setScannedCode(code);
                      handleProcessScan(code);
                    }}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 font-mono transition-colors"
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


