'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="bg-[#F4F6F9] min-h-screen flex flex-col font-body-md text-on-surface">
      {/* TopNavBar */}
      <header className="bg-surface w-full top-0 sticky border-b border-outline-variant z-50">
        <div className="flex justify-between items-center h-16 px-lg max-w-container-max mx-auto">
          {/* Brand */}
          <div className="font-headline-md text-headline-md font-bold text-primary flex items-center">
            LOGISLOT
          </div>
          {/* Trailing Icons */}
          <div className="flex items-center gap-md">
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center p-lg">
        <div className="max-w-xl w-full flex flex-col items-center text-center">
          {/* Illustration */}
          <div className="mb-8 w-64 h-64 rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant flex items-center justify-center p-md shadow-sm">
            <img alt="Access Denied Illustration" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhXeifjRioAoEXi03a0ix44q2l4ZSimhxF-2mqP3ywcD3mfZBeFQU094Zfx7Rnn-5fyI-8s5QeKFGqoOKSvGJrR3JKFpfQuUmWmyeQqxXFxXML9ngv2MtOxobLpee68J5gIn0EQdBEqsGELt316LryyYTEFrLYgObseRX8YQATChq_cSBDXFeFjZVWbhsuBcIDtuuWYRAHIiCaf5zS2m8eaHHzcTrYywf48TszU_5ID0Bx03-emrk6fzs6BX3mlDEwBXQVrIUnjA"/>
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
            <Link href="/" className="flex items-center justify-center px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
              Ke Halaman Utama
            </Link>
          </div>
          
          {/* Footer Text */}
          <p className="font-label-md text-label-md text-outline">
            Jika Anda merasa ini kesalahan, hubungi System Admin
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background w-full mt-auto border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center py-md px-lg max-w-container-max mx-auto font-label-md text-label-md text-outline">
          <div className="mb-4 md:mb-0">
            <span className="font-headline-sm text-headline-sm font-bold text-primary block mb-1">LOGISLOT</span>
            © 2026 LOGISLOT Enterprise. All rights reserved.
          </div>
          <div className="flex gap-lg">
            <a className="text-outline hover:text-secondary transition-colors cursor-default" href="#">Privacy Policy</a>
            <a className="text-outline hover:text-secondary transition-colors cursor-default" href="#">Terms of Service</a>
            <a className="text-outline hover:text-secondary transition-colors cursor-default" href="#">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
