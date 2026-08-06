'use client';

import { usePathname } from 'next/navigation';
import { startTourForPath } from '../lib/tours';

interface DriverTourButtonProps {
  variant?: 'header' | 'floating' | 'button';
}

export default function DriverTourButton({ variant = 'header' }: DriverTourButtonProps) {
  const pathname = usePathname();

  const handleStartTour = () => {
    startTourForPath(pathname);
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleStartTour}
        title="Mulai Panduan Tour Interaktif"
        className="fixed bottom-6 right-6 z-50 bg-[#1B365D] hover:bg-[#2A4874] text-white p-3.5 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 group"
      >
        <span className="material-symbols-outlined text-[22px] group-hover:rotate-12 transition-transform">help_outline</span>
        <span className="text-sm font-semibold pr-1 hidden sm:inline">Panduan Tour</span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleStartTour}
        className="inline-flex items-center gap-2 bg-[#1B365D]/10 hover:bg-[#1B365D]/20 text-[#1B365D] px-3.5 py-1.5 rounded-lg font-medium text-sm transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">explore</span>
        <span>Panduan Tour</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleStartTour}
      title="Panduan Tour Interaktif Halaman Ini"
      className="flex items-center gap-1.5 bg-[#1B365D]/10 hover:bg-[#1B365D]/20 text-[#1B365D] px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200"
    >
      <span className="material-symbols-outlined text-[18px] text-[#1B365D]">help_outline</span>
      <span className="hidden md:inline">Panduan Halaman</span>
    </button>
  );
}
