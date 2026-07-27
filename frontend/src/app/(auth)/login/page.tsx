'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.status === 'success') {
        const { token, user } = res.data.data;
        login({ user, token });
        
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-background min-h-screen flex flex-col md:flex-row antialiased text-on-background font-body-lg w-full">
      {/* Left Column (Brand/Value Prop) */}
      <div className="md:w-[60%] flex flex-col justify-between p-lg md:p-xl bg-gradient-to-br from-primary-container to-[#2E5B82] text-white">
        {/* Header */}
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white mb-xs tracking-tight">LOGISLOT</h1>
          <p className="font-body-md text-body-md text-secondary-fixed">Truck Booking &amp; Fleet Tracking System</p>
        </div>
        
        {/* Center Illustration */}
        <div className="flex-grow flex items-center justify-center py-xl relative max-w-[80%] mx-auto w-full">
          <img alt="Logistics Platform Illustration" className="w-full h-auto max-h-[400px] object-contain drop-shadow-2xl opacity-90 rounded-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8OMz9bOdWnkz0b2Yed6ay6v_6E_dPDKqRjdB61HuEnYQqx-MdTEZETymObjnUrmLW69Fy6DFL4Zy9n9s2J2MkB_vED7yRRR8SKHzrdv5B6ms8nGmNlwyeGWyh28RTIJU3hUVKI_-OxFoAuc6SzZ1CTol63WZKqJGYOC5GarSxbu12diS00Yyr9zlol9qwnJmNRf2KyIl_1cvB40ZzuoXm8rbDUCHb2r9nq_lDvlfp0kDJf4fDZtcKcZaI--IUuy7VHOpMcSvybQ"/>
        </div>
        
        {/* Value Props */}
        <div className="mt-auto space-y-md md:max-w-md">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
            </div>
            <span className="font-body-md text-body-md text-white/90 font-medium">Booking slot tanpa antre</span>
          </div>
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>my_location</span>
            </div>
            <span className="font-body-md text-body-md text-white/90 font-medium">Tracking real-time</span>
          </div>
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
            </div>
            <span className="font-body-md text-body-md text-white/90 font-medium">Terintegrasi dari gerbang sampai gudang</span>
          </div>
        </div>
      </div>
      
      {/* Right Column (Login Form) */}
      <div className="md:w-[40%] flex flex-col justify-center items-center p-lg md:p-xl bg-surface relative min-h-[60vh] md:min-h-screen">
        <div className="w-full max-w-[380px] bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
          <div className="mb-xl text-center md:text-left">
            <h2 className="font-headline-md text-headline-md text-primary mb-xs">Masuk ke Akun Anda</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Kelola pemesanan slot dan pelacakan armada Anda</p>
          </div>
          
          {error && <div className="p-sm mb-sm bg-error/10 text-error rounded-md text-sm">{error}</div>}
          <form className="space-y-lg" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-xs">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">mail</span>
                </div>
                <input 
                  className="w-full pl-xl pr-sm py-sm font-body-md text-body-md text-on-surface border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-secondary rounded-lg transition-colors placeholder:text-outline" 
                  placeholder="Masukkan email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-xs">
                <label className="block font-label-md text-label-md text-on-surface">Kata Sandi</label>
                <Link className="font-label-md text-label-md text-secondary hover:text-primary transition-colors" href="/forgot-password">Lupa kata sandi?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </div>
                <input 
                  className="w-full pl-xl pr-xl py-sm font-body-md text-body-md text-on-surface border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-secondary rounded-lg transition-colors placeholder:text-outline" 
                  placeholder="Masukkan kata sandi" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button className="absolute inset-y-0 right-0 pr-sm flex items-center text-outline hover:text-on-surface transition-colors" type="button">
                  <span className="material-symbols-outlined">visibility_off</span>
                </button>
              </div>
            </div>
            
            {/* Submit */}
            <button 
              className="w-full bg-primary hover:bg-primary/90 text-on-primary font-body-lg text-body-lg font-bold py-md rounded-lg transition-colors flex justify-center items-center gap-sm mt-md disabled:opacity-50" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
            
            {/* Divider */}
            <div className="relative flex items-center py-md">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink-0 mx-md text-outline font-label-md text-label-md">atau</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>
            
            {/* Register Link */}
            <div className="text-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Belum punya akun sebagai Supplier? <br/>
                <Link className="font-medium text-secondary hover:text-primary transition-colors hover:underline" href="/register">Daftar di sini</Link>
              </p>
            </div>
          </form>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-lg w-full text-center px-lg">
          <p className="font-label-md text-label-md text-outline">© 2026 LOGISLOT — Internal Use Only</p>
        </div>
      </div>
    </div>
  );
}
