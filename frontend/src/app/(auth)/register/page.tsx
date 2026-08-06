'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col md:flex-row w-full">
      {/* Left Column (60%) */}
      <div className="hidden md:flex flex-col w-full md:w-[60%] bg-primary-container p-xl justify-between relative overflow-hidden">
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-container z-0 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-xs mb-sm">
              <span className="material-symbols-outlined text-on-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
              <h1 className="font-headline-lg text-headline-lg text-on-primary">LOGISLOT</h1>
            </div>
            <p className="font-body-lg text-body-lg text-secondary-fixed">Truck Booking &amp; Fleet Tracking System</p>
          </div>
          
          <div className="my-xl max-w-[80%] mx-auto relative h-64 w-full">
            <img alt="Logistics platform illustration" className="w-full h-full object-contain filter drop-shadow-xl" src="https://lh3.googleusercontent.com/aida/AP1WRLv0IgccIhgtVH1lm396S18TiLmdoOzj5crj2X3Bva6Mtg56wnxVpgDjC6MUwjuof3dTKUSkNn6r_Vu_71KXYo0KW4crcPzWfs1mb8nJdLvk6lfsvDDM3VrYzh5gn6oFZKSMM96EizIIg2b189z5AfaQYz50Dg6grSFlpzzsMiSOT7Kql4N7MzvbXXfFIxc_L-G7LGTV_RjPu0yjbXiyjX6YP2yuc40BBxtlqw1lNvqyp2ykPfalDR6TPg"/>
          </div>
          
          <div className="space-y-md">
            <div className="flex items-start gap-md">
              <div className="bg-primary/50 p-xs rounded-full mt-xs">
                <span className="material-symbols-outlined text-secondary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-primary">Booking slot tanpa antre</h3>
                <p className="font-body-md text-body-md text-secondary-fixed">Jadwalkan kedatangan armada Anda dengan presisi.</p>
              </div>
            </div>
            <div className="flex items-start gap-md">
              <div className="bg-primary/50 p-xs rounded-full mt-xs">
                <span className="material-symbols-outlined text-secondary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-primary">Tracking real-time</h3>
                <p className="font-body-md text-body-md text-secondary-fixed">Pantau pergerakan armada secara akurat.</p>
              </div>
            </div>
            <div className="flex items-start gap-md">
              <div className="bg-primary/50 p-xs rounded-full mt-xs">
                <span className="material-symbols-outlined text-secondary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>warehouse</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-primary">Terintegrasi dari gerbang sampai gudang</h3>
                <p className="font-body-md text-body-md text-secondary-fixed">Alur kerja logistik yang mulus dan termonitor.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (40%) */}
      <div className="w-full md:w-[40%] bg-surface-container-lowest flex flex-col justify-center p-xl md:p-[48px] overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-xs mb-lg justify-center">
          <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">LOGISLOT</h1>
        </div>
        
        <div className="max-w-[440px] w-full mx-auto">
          <h2 className="font-headline-md text-headline-md text-primary-container mb-xs">Daftar sebagai Supplier</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-xl">Lengkapi data perusahaan Anda untuk mulai memesan slot pengiriman.</p>
          
          <form className="space-y-md" suppressHydrationWarning>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="picName">Nama Lengkap PIC</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input className="block w-full pl-10 pr-3 py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface focus:ring-secondary focus:border-secondary transition-colors" id="picName" placeholder="Masukkan nama lengkap" type="text" suppressHydrationWarning />
              </div>
            </div>
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="companyName">Nama Perusahaan/Instansi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">domain</span>
                </div>
                <input className="block w-full pl-10 pr-3 py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface focus:ring-secondary focus:border-secondary transition-colors" id="companyName" placeholder="PT. Contoh Logistik" type="text" suppressHydrationWarning />
              </div>
            </div>
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="email">Email Perusahaan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input className="block w-full pl-10 pr-3 py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface focus:ring-secondary focus:border-secondary transition-colors" id="email" placeholder="email@perusahaan.com" type="email" suppressHydrationWarning />
              </div>
              <p className="font-body-md text-[12px] text-on-surface-variant mt-xs">Gunakan email resmi perusahaan</p>
            </div>
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="phone">Nomor Telepon/WhatsApp</label>
              <div className="flex">
                <span className="inline-flex items-center px-sm py-sm rounded-l-lg border border-r-0 border-outline-variant bg-surface-container-low text-on-surface font-body-md">
                  +62
                </span>
                <input className="block w-full px-sm py-sm bg-surface-container-lowest border border-outline-variant rounded-r-lg text-on-surface focus:ring-secondary focus:border-secondary transition-colors" id="phone" placeholder="81234567890" type="tel" suppressHydrationWarning />
              </div>
            </div>
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="password">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input className="block w-full pl-10 pr-3 py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface focus:ring-secondary focus:border-secondary transition-colors" id="password" placeholder="••••••••" type="password" suppressHydrationWarning />
              </div>
              <div className="mt-sm">
                <div className="h-[4px] w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                  <div className="h-full bg-surface-container-highest w-1/3 transition-all duration-300"></div>
                  <div className="h-full bg-surface-container-highest w-1/3 transition-all duration-300"></div>
                  <div className="h-full bg-surface-container-highest w-1/3 transition-all duration-300"></div>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="confirmPassword">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input className="block w-full pl-10 pr-3 py-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface focus:ring-secondary focus:border-secondary transition-colors" id="confirmPassword" placeholder="••••••••" type="password" suppressHydrationWarning />
              </div>
            </div>
            
            <div className="flex items-start pt-xs">
              <div className="flex items-center h-5">
                <input className="w-4 h-4 border border-outline-variant rounded bg-surface-container-lowest focus:ring-secondary text-primary-container" id="terms" type="checkbox" suppressHydrationWarning />
              </div>
              <label className="ml-sm font-body-md text-[13px] text-on-surface-variant leading-tight" htmlFor="terms">
                Saya menyetujui Syarat &amp; Ketentuan penggunaan sistem LOGISLOT
              </label>
            </div>
            
            <Link href="/register/success" className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-[12px] rounded-lg hover:bg-primary transition-colors flex justify-center items-center mt-lg" type="button" suppressHydrationWarning>
              Daftar Sekarang
            </Link>
          </form>
          
          <div className="mt-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Sudah punya akun? <Link className="text-[#2E5B82] font-semibold hover:underline" href="/login">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
