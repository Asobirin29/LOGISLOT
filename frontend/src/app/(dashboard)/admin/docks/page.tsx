'use client';

import { useState } from 'react';

export default function LoadingDockPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <header className="px-xl py-lg flex justify-between items-center border-b border-outline-variant bg-surface-container-lowest z-10 sticky top-0">
        <h1 className="font-headline-lg text-headline-lg font-bold text-primary-container">Manajemen Loading Dock</h1>
        <button className="bg-primary text-on-primary font-label-md text-label-md py-sm px-md rounded-lg flex items-center gap-sm hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-lg">add</span>
          Tambah Dock Baru
        </button>
      </header>
      
      {/* Scrollable Content Canvas */}
      <div className="p-xl flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
          
          {/* Dock Card 1 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col relative group hover:border-secondary transition-colors duration-200">
            <button className="absolute top-md right-md text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <div className="mb-md">
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Dock 1</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Raw Material</p>
            </div>
            <div className="mb-lg">
              <span className="inline-flex items-center px-sm py-xs rounded-full bg-surface-container-low text-on-surface text-label-md font-label-md border border-outline-variant">
                Kapasitas: 1 Truk
              </span>
            </div>
            <div className="mt-auto flex justify-between items-center pt-md border-t border-outline-variant">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status: Aktif</span>
              <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                <input defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-outline-variant appearance-none cursor-pointer z-10 checked:right-0 checked:border-secondary transition-all duration-200" id="toggle1" name="toggle" type="checkbox" />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-outline-variant cursor-pointer transition-colors duration-200" htmlFor="toggle1"></label>
              </div>
            </div>
          </div>
          
          {/* Dock Card 2 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col relative group hover:border-secondary transition-colors duration-200">
            <button className="absolute top-md right-md text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <div className="mb-md">
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Dock 2</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Packaging</p>
            </div>
            <div className="mb-lg">
              <span className="inline-flex items-center px-sm py-xs rounded-full bg-surface-container-low text-on-surface text-label-md font-label-md border border-outline-variant">
                Kapasitas: 2 Truk
              </span>
            </div>
            <div className="mt-auto flex justify-between items-center pt-md border-t border-outline-variant">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status: Aktif</span>
              <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                <input defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-outline-variant appearance-none cursor-pointer z-10 checked:right-0 checked:border-secondary transition-all duration-200" id="toggle2" name="toggle" type="checkbox" />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-outline-variant cursor-pointer transition-colors duration-200" htmlFor="toggle2"></label>
              </div>
            </div>
          </div>
          
          {/* Dock Card 3 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col relative group hover:border-secondary transition-colors duration-200">
            <button className="absolute top-md right-md text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <div className="mb-md">
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Dock 3</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Spare Parts</p>
            </div>
            <div className="mb-lg">
              <span className="inline-flex items-center px-sm py-xs rounded-full bg-surface-container-low text-on-surface text-label-md font-label-md border border-outline-variant">
                Kapasitas: 1 Truk
              </span>
            </div>
            <div className="mt-auto flex justify-between items-center pt-md border-t border-outline-variant">
              <span className="font-label-md text-label-md text-error uppercase tracking-wider">Maintenance</span>
              <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                <input className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-outline-variant appearance-none cursor-pointer z-10 checked:right-0 checked:border-secondary transition-all duration-200" id="toggle3" name="toggle" type="checkbox" />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-outline-variant cursor-pointer transition-colors duration-200" htmlFor="toggle3"></label>
              </div>
            </div>
          </div>
          
          {/* Dock Card 4 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col relative group hover:border-secondary transition-colors duration-200">
            <button className="absolute top-md right-md text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <div className="mb-md">
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Dock 4</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Finished Goods</p>
            </div>
            <div className="mb-lg">
              <span className="inline-flex items-center px-sm py-xs rounded-full bg-surface-container-low text-on-surface text-label-md font-label-md border border-outline-variant">
                Kapasitas: 3 Truk
              </span>
            </div>
            <div className="mt-auto flex justify-between items-center pt-md border-t border-outline-variant">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status: Aktif</span>
              <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
                <input defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-outline-variant appearance-none cursor-pointer z-10 checked:right-0 checked:border-secondary transition-all duration-200" id="toggle4" name="toggle" type="checkbox" />
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-outline-variant cursor-pointer transition-colors duration-200" htmlFor="toggle4"></label>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked {
            right: 0;
            border-color: var(--color-secondary); /* Needs to use a tailwind color but we can approximate or use #356289 */
            border-color: #356289;
        }
        .toggle-checkbox:checked + .toggle-label {
            background-color: #356289;
        }
        .toggle-checkbox:checked + .toggle-label:after {
            transform: translateX(100%);
            border-color: white;
        }
      `}} />
    </div>
  );
}
