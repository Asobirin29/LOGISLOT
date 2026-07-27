'use client';

import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="flex-grow flex items-center justify-center p-lg bg-[#F4F6F9] min-h-screen">
      <div className="max-w-xl w-full flex flex-col items-center text-center">
        {/* Illustration */}
        <div className="mb-8 w-64 h-64 rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant flex items-center justify-center p-md shadow-sm">
          {/* We'll use an icon since the image might not be available */}
          <span className="material-symbols-outlined text-[120px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>block</span>
        </div>
        
        {/* Error Code */}
        <h1 className="text-[72px] leading-none font-bold text-primary-container mb-2 tracking-tighter">
          403
        </h1>
        
        {/* Title */}
        <h2 className="text-[22px] font-bold text-primary-container mb-4">
          Akses Ditolak
        </h2>
        
        {/* Description */}
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-md mx-auto">
          Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini khusus untuk role tertentu dalam sistem LOGISLOT.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-md mb-12">
          <button onClick={() => window.history.back()} className="flex items-center justify-center gap-sm px-6 py-3 border border-secondary text-secondary rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors focus:ring-2 focus:ring-secondary focus:outline-none">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali
          </button>
          <Link href="/dashboard" className="flex items-center justify-center px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
            Ke Dashboard Saya
          </Link>
        </div>
        
        {/* Footer Text */}
        <p className="font-label-md text-label-md text-outline">
          Jika Anda merasa ini kesalahan, hubungi System Admin
        </p>
      </div>
    </div>
  );
}
