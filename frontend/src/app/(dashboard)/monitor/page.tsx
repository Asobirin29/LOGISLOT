'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtimeBookings } from '@/lib/useRealtimeBookings';
import { format } from 'date-fns';
import ProtectedRoute from '../../../components/ProtectedRoute';

interface Booking {
  id: number;
  status: string;
  nomor_po: string;
  plat_nomor_truk: string;
  jenis_armada: string;
  user: {
    nama: string;
  };
  time_slot: {
    jam_mulai: string;
    jam_selesai: string;
  };
  loading_dock: {
    nama_dock: string;
  };
  _isNewUpdate?: boolean;
}

export default function FIDSDashboard() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchQueue = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${baseUrl}/gate/queue`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        // Sort by time_slot
        const sorted = (json.data || []).sort((a: Booking, b: Booking) => 
          a.time_slot.jam_mulai.localeCompare(b.time_slot.jam_mulai)
        );
        setData(sorted);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const { bookings } = useRealtimeBookings<Booking>(data, fetchQueue);

  // Auto scroll effect
  useEffect(() => {
    let scrollInterval: any;
    if (containerRef.current) {
      scrollInterval = setInterval(() => {
        if (containerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
          if (scrollTop + clientHeight >= scrollHeight) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            containerRef.current.scrollBy({ top: 1, behavior: 'auto' });
          }
        }
      }, 50);
    }
    return () => clearInterval(scrollInterval);
  }, []);

  // Compute metrics
  const totalToday = bookings.length;
  const atGate = bookings.filter(b => b.status === 'arrived').length;
  const unloading = bookings.filter(b => b.status === 'unloading').length;
  const completed = bookings.filter(b => b.status === 'completed').length;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'booked': return <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-lg">SCHEDULED</span>;
      case 'arrived': return <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-lg font-bold">ARRIVED / WAITING</span>;
      case 'unloading': return <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-lg animate-pulse">UNLOADING</span>;
      case 'completed': return <span className="bg-green-600 text-white px-3 py-1 rounded-full text-lg">COMPLETED</span>;
      default: return <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-lg">{status.toUpperCase()}</span>;
    }
  };

  if (loading) {
    return <div className="h-screen w-screen bg-black flex items-center justify-center text-white text-3xl">Loading FIDS...</div>;
  }

  return (
    <ProtectedRoute allowedRoles={['ic', 'warehouse', 'admin']}>
      <div className="h-screen w-screen bg-gray-900 text-white overflow-hidden flex flex-col font-sans">
        {/* HEADER */}
      <div className="bg-black p-6 border-b border-gray-700 flex justify-between items-center shrink-0 shadow-lg">
        <div>
          <h1 className="text-4xl font-bold tracking-widest text-blue-400">LOGISLOT FIDS</h1>
          <p className="text-xl text-gray-400 mt-2">REAL-TIME MONITORING</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-mono tracking-wider">{format(new Date(), 'HH:mm')}</div>
          <div className="text-xl text-gray-400">{format(new Date(), 'dd MMMM yyyy')}</div>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-4 gap-4 p-6 shrink-0 bg-gray-800">
        <div className="bg-gray-700 p-4 rounded border-l-4 border-blue-500">
          <div className="text-gray-400 text-lg uppercase">Total Hari Ini</div>
          <div className="text-4xl font-bold">{totalToday}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded border-l-4 border-yellow-500">
          <div className="text-gray-400 text-lg uppercase">Di Gerbang (Menunggu)</div>
          <div className="text-4xl font-bold">{atGate}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded border-l-4 border-purple-500">
          <div className="text-gray-400 text-lg uppercase">Sedang Unloading</div>
          <div className="text-4xl font-bold">{unloading}</div>
        </div>
        <div className="bg-gray-700 p-4 rounded border-l-4 border-green-500">
          <div className="text-gray-400 text-lg uppercase">Selesai</div>
          <div className="text-4xl font-bold">{completed}</div>
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-900 text-gray-400 text-xl font-bold uppercase tracking-widest border-b border-gray-700 shrink-0">
        <div>WAKTU SLOT</div>
        <div>PLAT NOMOR</div>
        <div className="col-span-2">SUPPLIER</div>
        <div>DOCK</div>
        <div>STATUS</div>
      </div>

      {/* TABLE BODY (SCROLLABLE) */}
      <div ref={containerRef} className="flex-1 overflow-y-auto hidden-scrollbar relative pb-20 bg-gray-900">
        <AnimatePresence>
          {bookings.filter(b => b.status !== 'completed').map((booking) => (
            <motion.div
              key={booking.id}
              layout
              initial={{ opacity: 0, x: -50 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                backgroundColor: booking._isNewUpdate ? 'rgba(59, 130, 246, 0.3)' : 'transparent' 
              }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className={`grid grid-cols-6 gap-4 px-6 py-5 border-b border-gray-800 text-2xl items-center ${booking._isNewUpdate ? 'animate-pulse' : ''}`}
            >
              <div className="font-mono text-blue-300">
                {booking.time_slot.jam_mulai.slice(11, 16)}
              </div>
              <div className="font-bold tracking-wider">{booking.plat_nomor_truk}</div>
              <div className="col-span-2 text-gray-300 truncate">{booking.user.nama}</div>
              <div className="font-bold text-yellow-400">
                {booking.loading_dock ? booking.loading_dock.nama_dock : 'WAITING'}
              </div>
              <div>{getStatusBadge(booking.status)}</div>
            </motion.div>
          ))}
        </AnimatePresence>
        {bookings.filter(b => b.status !== 'completed').length === 0 && (
          <div className="text-center p-10 text-gray-500 text-2xl">
            Tidak ada aktivitas jadwal truk saat ini.
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hidden-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hidden-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
    </ProtectedRoute>
  );
}
