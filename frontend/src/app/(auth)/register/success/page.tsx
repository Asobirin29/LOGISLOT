'use client';

import Link from 'next/link';

export default function RegisterSuccessPage() {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen font-body-md text-on-surface">
      {/* Left Column: Branding / Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-primary-container relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover opacity-90" data-alt="A stylized, flat-vector geometric illustration in a Corporate Modern style showing a high-efficiency logistics warehouse at night. The scene is rendered in deep navy blues, crisp whites, and cool greys. A large semi-truck is docked at a loading bay, illuminated by angular beams of light. Silhouettes of industrial structures, silos, and factory smokestacks are visible in the background under a crescent moon. The aesthetic is clean, precise, and systematic, conveying reliability and scale." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBzBMXYw4wd-RmgrUQwhfMYAB0gG6cghn72rb0Hqucqg9krgHPwB5YnrVQsJzroCkxj5sBsNGUDfmTCx4fjbsnd_AnHQ03yS96Vxm1tNCozyIqMCYnSsus4ZmT9Y4dRH8YnC95Ymt_xjwm3veQ822Sv9R59vIWP_9La2dXCuj4LQhAUtHLxvXHKNviL_kMlAlugujQNoX0cNuvHdH8oUogKoVbY4tOZ5yOiMcmKzmhFsraBZ2O7Qov0ZYFsxRqEpJWyB5jI7FGNA"/>
        </div>
        <div className="relative z-10 w-full max-w-lg text-on-primary p-8 rounded-xl bg-primary-container/80 backdrop-blur-sm border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>package_2</span>
            <h1 className="font-headline-lg text-headline-lg text-on-primary m-0">LOGISLOT</h1>
          </div>
          <p className="font-body-lg text-body-lg text-surface-container-high mb-8">
            The definitive platform for high-efficiency global supply chain orchestration and intelligent dock management.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/50 p-2 rounded-lg border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary-container">speed</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-primary mb-1">Accelerated Operations</h3>
                <p className="font-body-md text-body-md text-surface-container-high">Streamline your loading dock throughput with predictive scheduling.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary/50 p-2 rounded-lg border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary-container">security</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-primary mb-1">Enterprise Security</h3>
                <p className="font-body-md text-body-md text-surface-container-high">Bank-grade encryption and robust compliance controls for sensitive logistics data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column: Success Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-8 sm:p-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mb-6 border-4 border-white shadow-sm ring-1 ring-outline-variant/30">
            <span className="material-symbols-outlined text-[#2E7D32]" style={{ fontSize: '40px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          
          <h2 className="font-headline-md text-headline-md font-bold text-primary-container mb-4">Pendaftaran Berhasil!</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 px-4">
            Silakan cek email Anda untuk verifikasi sebelum login.
          </p>
          
          <div className="w-full space-y-4">
            <Link href="/login" className="w-full py-3 px-6 bg-primary-container hover:bg-primary transition-colors text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">login</span>
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
