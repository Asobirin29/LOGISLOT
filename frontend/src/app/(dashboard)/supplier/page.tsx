'use client';

import { useState } from 'react';

export default function SupplierDashboard() {
  const [selectedDate, setSelectedDate] = useState<number>(24);
  const [currentMonth, setCurrentMonth] = useState('Oktober 2026');

  // Dummy slots data based on design
  const slots = [
    { time: '08:00 - 09:00', dock: 'Dock 1 - Raw Material', status: 'available', available: 3, total: 5 },
    { time: '09:00 - 10:00', dock: 'Dock 1 - Raw Material', status: 'limited', available: 1, total: 5 },
    { time: '10:00 - 11:00', dock: 'Dock 1 - Raw Material', status: 'full', available: 0, total: 5 },
    { time: '11:00 - 12:00', dock: 'Dock 1 - Raw Material', status: 'available', available: 5, total: 5 },
    { time: '12:00 - 13:00', dock: 'Break', status: 'break' },
    { time: '13:00 - 14:00', dock: 'Dock 1 - Raw Material', status: 'available', available: 2, total: 5 },
  ];

  return (
    <div className="flex gap-gutter w-full h-full">
      {/* Left Column: Calendar (60%) */}
      <div className="w-[60%] flex flex-col gap-md" data-tour="supplier-calendar-overview">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col h-full">
          <div className="flex justify-between items-center mb-xl" data-tour="supplier-calendar-month">
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">{currentMonth}</h3>
            <div className="flex gap-sm">
              <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-sm mb-sm">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
              <div key={day} className="text-center font-label-md text-label-md text-on-surface-variant uppercase">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-sm flex-1">
            {/* Previous month empty slots */}
            {[27, 28, 29, 30].map(d => (
              <div key={`prev-${d}`} className="aspect-square flex flex-col items-center justify-center p-xs border border-transparent text-outline-variant opacity-50 cursor-not-allowed">
                {d}
              </div>
            ))}
            
            {/* Current month dates */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isSelected = day === selectedDate;
              const isToday = day === 23;
              const hasFull = day === 1 || day === 2;
              const hasAvailable = day === 23 || day === 25 || day === 26;
              const hasLimited = day === 24;

              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square flex flex-col items-center justify-center p-xs rounded cursor-pointer relative group transition-colors ${
                    isSelected 
                      ? 'border-2 border-primary bg-primary text-white shadow-md font-bold' 
                      : isToday
                      ? 'border-2 border-primary bg-surface-container-low text-primary font-bold hover:border-outline-variant'
                      : 'border border-transparent hover:border-outline-variant text-on-surface'
                  }`}
                >
                  <span>{day}</span>
                  <div className="absolute bottom-2 flex gap-1">
                    {hasFull && <div className="w-1.5 h-1.5 rounded-full bg-error"></div>}
                    {hasAvailable && <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>}
                    {hasLimited && <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-md flex gap-md justify-center text-xs font-label-md text-label-md text-on-surface-variant">
            <div className="flex items-center gap-xs"><div className="w-2 h-2 rounded-full bg-[#10B981]"></div> Slot Tersedia</div>
            <div className="flex items-center gap-xs"><div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div> Slot Terbatas</div>
            <div className="flex items-center gap-xs"><div className="w-2 h-2 rounded-full bg-error"></div> Slot Penuh</div>
          </div>
        </div>
      </div>

      {/* Right Column: Available Slots (40%) */}
      <div className="w-[40%] flex flex-col" data-tour="supplier-slot-list">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col h-full overflow-hidden">
          <div className="p-lg border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10">
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Slot Tersedia — {selectedDate} {currentMonth}</h3>
            <p className="text-sm text-on-surface-variant mt-xs">Pilih slot waktu untuk pengiriman ke Dock 1.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-md space-y-sm bg-background">
            {slots.map((slot, idx) => {
              if (slot.status === 'break') {
                return (
                  <div key={idx} className="bg-surface-variant/30 border border-outline-variant/50 rounded p-md flex items-center justify-center opacity-60 bg-striped">
                    <div className="font-bold text-on-surface-variant flex items-center gap-xs text-center">
                      <span className="material-symbols-outlined text-[18px]">restaurant</span> Istirahat ({slot.time})
                    </div>
                  </div>
                );
              }
              
              if (slot.status === 'full') {
                return (
                  <div key={idx} className="bg-surface-variant/30 border border-outline-variant/50 rounded p-md flex items-center justify-between opacity-60">
                    <div>
                      <div className="font-bold text-on-surface-variant flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[18px]">schedule</span> {slot.time}
                      </div>
                      <div className="text-sm text-on-surface-variant mt-xs">{slot.dock}</div>
                    </div>
                    <div className="flex flex-col items-end gap-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-variant text-on-surface-variant border border-outline-variant">
                        Penuh
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded p-md flex items-center justify-between hover:border-primary transition-colors group">
                  <div>
                    <div className="font-bold text-primary flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[18px]">schedule</span> {slot.time}
                    </div>
                    <div className="text-sm text-on-surface-variant mt-xs">{slot.dock}</div>
                  </div>
                  <div className="flex flex-col items-end gap-sm">
                    {slot.status === 'available' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                        {slot.available}/{slot.total} tersedia
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#fffbeb] text-[#92400e] border border-[#fde68a]">
                        {slot.available}/{slot.total} tersedia
                      </span>
                    )}
                    <button className="px-md py-xs bg-primary text-white rounded text-sm font-semibold hover:bg-on-primary-fixed-variant transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                      Pilih
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .bg-striped {
            background-image: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(203, 213, 225, 0.2) 10px,
                rgba(203, 213, 225, 0.2) 20px
            );
        }
      `}} />
    </div>
  );
}
