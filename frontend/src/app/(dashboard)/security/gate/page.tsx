'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import { useAuth } from '../../../../context/AuthContext';
import {
  scanQR,
  manualCheckin,
  fetchQueue,
  ScanResult,
  QueueBooking,
  formatTimeWIB,
  playScanSound,
  triggerVibration,
} from '../../../../lib/gate';
import {
  QrCode, Keyboard, List, CheckCircle, AlertTriangle,
  XCircle, LogOut, Clock, Truck, Package, RefreshCw, X, Zap
} from 'lucide-react';

type Screen = 'main' | 'scanner' | 'manual' | 'queue';

export default function SecurityGatePage() {
  return (
    <ProtectedRoute allowedRoles={['security', 'admin']}>
      <SecurityGate />
    </ProtectedRoute>
  );
}

function SecurityGate() {
  const { user, logout } = useAuth();
  const [screen, setScreen] = useState<Screen>('main');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [queue, setQueue] = useState<QueueBooking[]>([]);
  const [queueLoading, setQueueLoading] = useState(false);

  const handleScanResult = useCallback((result: ScanResult) => {
    setScanResult(result);
    const success = result.status === 'success';
    playScanSound(success);
    triggerVibration(success);
    setScreen('main');
  }, []);

  const loadQueue = useCallback(async () => {
    setQueueLoading(true);
    try {
      const data = await fetchQueue();
      setQueue(data);
    } catch (e) {
      console.error('Queue load failed', e);
    } finally {
      setQueueLoading(false);
    }
  }, []);

  useEffect(() => {
    if (screen === 'queue') loadQueue();
  }, [screen, loadQueue]);

  return (
    <div className="min-h-screen bg-gray-900 text-white select-none">
      {/* Compact top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-bold tracking-wide">LOGISLOT GATE</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{user?.nama}</span>
          <button onClick={logout} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition">
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Main Screen */}
      {screen === 'main' && (
        <MainScreen
          scanResult={scanResult}
          onScan={() => setScreen('scanner')}
          onManual={() => setScreen('manual')}
          onQueue={() => setScreen('queue')}
          onDismiss={() => setScanResult(null)}
        />
      )}

      {screen === 'scanner' && (
        <QRScannerScreen onResult={handleScanResult} onBack={() => setScreen('main')} />
      )}

      {screen === 'manual' && (
        <ManualCheckinScreen onResult={handleScanResult} onBack={() => setScreen('main')} />
      )}

      {screen === 'queue' && (
        <QueueScreen queue={queue} loading={queueLoading} onRefresh={loadQueue} onBack={() => setScreen('main')} />
      )}
    </div>
  );
}

// ====================== MAIN SCREEN ======================

function MainScreen({
  scanResult, onScan, onManual, onQueue, onDismiss
}: {
  scanResult: ScanResult | null;
  onScan: () => void;
  onManual: () => void;
  onQueue: () => void;
  onDismiss: () => void;
}) {
  const now = new Date();

  return (
    <div className="flex flex-col min-h-[calc(100vh-52px)] px-4 py-6 gap-5">
      {/* Clock */}
      <div className="text-center">
        <p className="text-5xl font-black tabular-nums tracking-tight text-white">
          {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Result Card */}
      {scanResult && (
        <ResultCard result={scanResult} onDismiss={onDismiss} />
      )}

      {/* Primary Action */}
      <button
        onClick={onScan}
        className="relative flex flex-col items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all duration-150 rounded-3xl py-10 shadow-2xl shadow-blue-900/50 min-h-[180px]"
      >
        <QrCode size={60} className="text-white" strokeWidth={1.5} />
        <span className="text-2xl font-black text-white tracking-wide">SCAN QR CODE</span>
        <span className="text-blue-200 text-sm">Tekan untuk membuka kamera</span>
      </button>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={onManual}
          className="flex flex-col items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 active:scale-95 transition-all rounded-2xl py-7"
        >
          <Keyboard size={32} className="text-gray-300" />
          <span className="text-base font-bold text-gray-200">Input Manual</span>
          <span className="text-xs text-gray-500">QR rusak / tidak terbaca</span>
        </button>
        <button
          onClick={onQueue}
          className="flex flex-col items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 active:scale-95 transition-all rounded-2xl py-7"
        >
          <List size={32} className="text-gray-300" />
          <span className="text-base font-bold text-gray-200">Antrian Hari Ini</span>
          <span className="text-xs text-gray-500">Lihat daftar truk</span>
        </button>
      </div>
    </div>
  );
}

// ====================== RESULT CARD ======================

function ResultCard({ result, onDismiss }: { result: ScanResult; onDismiss: () => void }) {
  const isSuccess = result.status === 'success';
  const isWarning = isSuccess && result.out_of_tolerance;
  const isCheckIn = result.event === 'CHECK_IN';
  const isCheckOut = result.event === 'CHECK_OUT';

  const bgColor = !isSuccess
    ? 'bg-red-900/80 border-red-500'
    : isWarning
    ? 'bg-amber-800/80 border-amber-400'
    : 'bg-green-900/80 border-green-400';

  const icon = !isSuccess
    ? <XCircle size={40} className="text-red-400" />
    : isWarning
    ? <AlertTriangle size={40} className="text-amber-400" />
    : <CheckCircle size={40} className="text-green-400" />;

  return (
    <div className={`relative rounded-2xl border-2 p-5 ${bgColor}`}>
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1 rounded-full bg-white/10 hover:bg-white/20 transition"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-4">
        <div className="shrink-0 mt-1">{icon}</div>
        <div className="flex-1 min-w-0">
          {isSuccess && result.data ? (
            <>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-sm font-black ${isCheckIn ? 'bg-blue-500' : 'bg-purple-500'} text-white`}>
                  {isCheckIn ? 'CHECK-IN' : 'CHECK-OUT'}
                </span>
                {isWarning && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-black">
                    {result.early ? `${Math.abs(result.selisih_menit || 0)} mnt lebih awal` : `${result.selisih_menit} mnt terlambat`}
                  </span>
                )}
              </div>

              <div className="space-y-1 text-sm">
                <p className="text-xl font-black text-white">{result.data.plat_nomor_truk}</p>
                <p className="text-gray-300">{result.data.supplier} · {result.data.instansi}</p>
                {isCheckIn && (
                  <>
                    <p className="text-gray-400 flex items-center gap-1 text-xs">
                      <Clock size={12} />
                      Jadwal: {result.data.jadwal_slot ? formatTimeWIB(result.data.jadwal_slot) : '-'}
                      &nbsp;·&nbsp;
                      Tiba: {result.data.waktu_aktual ? formatTimeWIB(result.data.waktu_aktual) : '-'}
                    </p>
                    <p className="text-gray-400 text-xs">Dock: {result.data.loading_dock} · {result.data.jenis_armada}</p>
                  </>
                )}
                {isCheckOut && result.data.turnaround_menit !== undefined && (
                  <p className="text-gray-300 text-xs">
                    Turnaround: <strong>{result.data.turnaround_menit} menit</strong>
                  </p>
                )}
                {result.data.nomor_po && (
                  <p className="text-gray-400 text-xs">PO: {result.data.nomor_po}</p>
                )}
              </div>

              {isWarning && (
                <div className="mt-3 p-2 rounded-xl bg-amber-400/20 border border-amber-400/40">
                  <p className="text-amber-300 text-xs font-semibold">
                    ⚠️ Kedatangan di luar toleransi ±30 menit. Check-in tetap berhasil dicatat.
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-red-300 font-semibold text-base leading-snug">{result.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ====================== QR SCANNER SCREEN ======================

function QRScannerScreen({ onResult, onBack }: { onResult: (r: ScanResult) => void; onBack: () => void }) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const html5QrRef = useRef<any>(null);

  useEffect(() => {
    let scanner: any = null;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        scanner = new Html5Qrcode('qr-reader');
        html5QrRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 15, qrbox: { width: 260, height: 260 } },
          async (decodedText: string) => {
            if (processing) return;
            setProcessing(true);
            try {
              let qrData = decodedText;
              // Handle JSON-encoded QR (from our ticket modal)
              try {
                const parsed = JSON.parse(decodedText);
                if (parsed.kode_qr) qrData = parsed.kode_qr;
              } catch { /* plain UUID */ }

              const result = await scanQR(qrData);
              await scanner?.stop();
              onResult(result);
            } catch (e) {
              setProcessing(false);
            }
          },
          () => {} // qr error — ignore, keep scanning
        );
        setScanning(true);
      } catch (err: any) {
        setError('Tidak bisa mengakses kamera. Pastikan izin kamera diberikan.');
        console.error(err);
      }
    };

    startScanner();

    return () => {
      html5QrRef.current?.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-52px)] items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white">
            <X size={20} />
          </button>
          <h2 className="text-xl font-black">Scan QR Code</h2>
        </div>

        {error ? (
          <div className="text-center p-6 bg-red-900/50 rounded-2xl border border-red-500">
            <XCircle size={40} className="text-red-400 mx-auto mb-3" />
            <p className="text-red-300 font-medium">{error}</p>
            <button onClick={onBack} className="mt-4 px-4 py-2 bg-white/10 rounded-xl text-sm">
              Kembali
            </button>
          </div>
        ) : (
          <>
            {/* QR Reader Container */}
            <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-blue-500/60 shadow-2xl shadow-blue-900/50">
              <div id="qr-reader" className="w-full" style={{ minHeight: '300px' }} />
              {/* Corner overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {['top-4 left-4 border-t-4 border-l-4',
                  'top-4 right-4 border-t-4 border-r-4',
                  'bottom-4 left-4 border-b-4 border-l-4',
                  'bottom-4 right-4 border-b-4 border-r-4'].map((cls, i) => (
                  <div key={i} className={`absolute w-8 h-8 border-blue-400 rounded-sm ${cls}`} />
                ))}
              </div>
            </div>

            <div className="text-center mt-5">
              {processing ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-blue-300 font-medium">Memproses...</span>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  {scanning ? 'Arahkan kamera ke QR Code tiket' : 'Memulai kamera...'}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ====================== MANUAL CHECKIN SCREEN ======================

function ManualCheckinScreen({ onResult, onBack }: { onResult: (r: ScanResult) => void; onBack: () => void }) {
  const [plat, setPlat] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plat.trim()) return;
    setLoading(true);
    const result = await manualCheckin(plat.trim());
    setLoading(false);
    onResult(result);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-52px)] items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
            <X size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black">Input Manual</h2>
            <p className="text-gray-400 text-xs">Gunakan jika QR tidak bisa dibaca</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-medium">Plat Nomor Truk</label>
            <input
              ref={inputRef}
              type="text"
              value={plat}
              onChange={e => setPlat(e.target.value.toUpperCase())}
              placeholder="B 1234 ABC"
              className="w-full bg-gray-800 border-2 border-gray-600 focus:border-blue-500 rounded-2xl px-5 py-4 text-2xl font-black text-white text-center tracking-widest uppercase outline-none transition"
              autoCapitalize="characters"
            />
          </div>

          <button
            type="submit"
            disabled={!plat.trim() || loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all rounded-2xl py-5 text-xl font-black flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle size={24} />
                Proses Check-In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ====================== QUEUE SCREEN ======================

function QueueScreen({
  queue, loading, onRefresh, onBack
}: {
  queue: QueueBooking[];
  loading: boolean;
  onRefresh: () => void;
  onBack: () => void;
}) {
  const now = new Date();

  return (
    <div className="flex flex-col min-h-[calc(100vh-52px)]">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-white/10">
        <button onClick={onBack} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
          <X size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-black">Antrian Hari Ini</h2>
          <p className="text-gray-400 text-xs">
            {now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} · {queue.length} truk
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : queue.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Truck size={48} className="mx-auto mb-3 opacity-30" />
            <p>Tidak ada truk terjadwal hari ini</p>
          </div>
        ) : (
          queue.map(booking => {
            const slotStart = new Date(booking.time_slot.jam_mulai);
            const slotEnd = new Date(booking.time_slot.jam_selesai);
            const slotDt = new Date();
            slotDt.setUTCHours(slotStart.getUTCHours(), slotStart.getUTCMinutes(), 0, 0);
            const isPast = slotDt < now && booking.status === 'booked';
            const isArrived = booking.status === 'arrived' || booking.status === 'unloading';

            return (
              <div
                key={booking.id}
                className={`rounded-2xl p-4 border-2 ${
                  isArrived
                    ? 'bg-emerald-900/40 border-emerald-500/50'
                    : isPast
                    ? 'bg-red-900/30 border-red-500/40'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xl font-black text-white">{booking.plat_nomor_truk}</span>
                      {booking.priority_level === 'urgent' && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
                          <Zap size={10} /> Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm font-medium">{booking.user.nama} · {booking.user.nama_instansi}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {booking.loading_dock.nama_dock} · {booking.jenis_armada}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">PO: {booking.nomor_po}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-black text-white tabular-nums">
                      {formatTimeWIB(booking.time_slot.jam_mulai)}
                    </p>
                    <p className="text-gray-500 text-xs">s/d {formatTimeWIB(booking.time_slot.jam_selesai)}</p>
                    <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                      isArrived ? 'bg-emerald-500 text-white' : isPast ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {isArrived ? 'Tiba ✓' : isPast ? 'Belum tiba' : 'Menunggu'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
