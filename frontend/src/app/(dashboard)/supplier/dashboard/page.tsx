'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import BookingFormModal from '../../../../components/BookingFormModal';
import BookingTicketModal from '../../../../components/BookingTicketModal';
import {
  fetchAvailableSlots,
  fetchMyBookings,
  cancelBooking as cancelBookingApi,
  SlotAvailability,
  Booking,
  formatDate,
  formatTime,
  statusColors,
  isActionAllowed,
} from '../../../../lib/booking';
import {
  Calendar,
  Truck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Clock,
  Package,
  ListOrdered,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

type ActiveTab = 'calendar' | 'mybookings';

export default function SupplierDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['supplier']}>
      <SupplierDashboard />
    </ProtectedRoute>
  );
}

function SupplierDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Booking state
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingFilter, setBookingFilter] = useState('');

  // Modal state
  const [selectedSlotForForm, setSelectedSlotForForm] = useState<{
    dock: SlotAvailability['dock'];
    slot: SlotAvailability['slots'][0];
  } | null>(null);
  const [ticketBooking, setTicketBooking] = useState<Booking | null>(null);

  const loadSlots = useCallback(async (date: string) => {
    setSlotsLoading(true);
    try {
      const data = await fetchAvailableSlots(date);
      setSlots(data);
    } catch (e: any) {
      console.error('Failed to load slots', e);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const loadMyBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const data = await fetchMyBookings(bookingFilter ? { status: bookingFilter } : undefined);
      setMyBookings(data);
    } catch (e) {
      console.error('Failed to load bookings', e);
    } finally {
      setBookingsLoading(false);
    }
  }, [bookingFilter]);

  useEffect(() => {
    loadSlots(selectedDate);
  }, [selectedDate, loadSlots]);

  useEffect(() => {
    if (activeTab === 'mybookings') loadMyBookings();
  }, [activeTab, loadMyBookings]);

  const handleDateSelect = (dateStr: string) => setSelectedDate(dateStr);

  const handleBookingSuccess = (booking: Booking) => {
    setSelectedSlotForForm(null);
    setTicketBooking(booking);
    loadSlots(selectedDate);
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Yakin ingin membatalkan booking ini?')) return;
    try {
      await cancelBookingApi(id);
      loadMyBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membatalkan booking');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans">
      {/* Navbar */}
      <nav className="bg-[#1B365D] text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Truck size={24} className="text-blue-300" />
          <span className="text-lg font-black tracking-tight">LOGISLOT</span>
          <span className="ml-2 px-2 py-0.5 bg-blue-800/60 rounded text-xs font-medium">Supplier</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-blue-200 hidden sm:block">{user?.nama}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <TabButton active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} icon={<Calendar size={16} />}>
            Booking Baru
          </TabButton>
          <TabButton active={activeTab === 'mybookings'} onClick={() => setActiveTab('mybookings')} icon={<ListOrdered size={16} />}>
            Booking Saya
          </TabButton>
        </div>

        {/* =================== CALENDAR TAB =================== */}
        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mini Calendar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  {calendarMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <CalendarGrid
                month={calendarMonth}
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
              />

              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-[#1B365D]">
                <p className="font-semibold">Tanggal dipilih:</p>
                <p className="text-xs mt-0.5">{formatDate(selectedDate)}</p>
              </div>
            </div>

            {/* Slot Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">
                  Ketersediaan Slot · <span className="text-[#1B365D]">{selectedDate}</span>
                </h3>
                <button
                  onClick={() => loadSlots(selectedDate)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition"
                  title="Refresh"
                >
                  <RefreshCw size={15} className="text-gray-500" />
                </button>
              </div>

              {slotsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-[#1B365D] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : slots.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center text-gray-400">
                  <Package size={40} className="mx-auto mb-2 opacity-40" />
                  <p>Tidak ada slot tersedia</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {slots.map(({ dock, slots: dockSlots }) => (
                    <div key={dock.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="px-5 py-3 bg-[#1B365D]/5 border-b border-gray-100 flex items-center gap-2">
                        <Package size={16} className="text-[#1B365D]" />
                        <span className="font-semibold text-[#1B365D] text-sm">{dock.nama_dock}</span>
                        {dock.deskripsi && (
                          <span className="text-xs text-gray-400 ml-1">· {dock.deskripsi}</span>
                        )}
                      </div>
                      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {dockSlots.map(item => (
                          <SlotCard
                            key={item.slot.id}
                            item={item}
                            onClick={() => item.tersedia && setSelectedSlotForForm({ dock, slot: item })}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================== MY BOOKINGS TAB =================== */}
        {activeTab === 'mybookings' && (
          <div>
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="text-sm font-medium text-gray-600">Filter status:</span>
              {['', 'booked', 'arrived', 'unloading', 'completed', 'cancelled'].map(s => (
                <button
                  key={s}
                  onClick={() => setBookingFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    bookingFilter === s
                      ? 'bg-[#1B365D] text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1B365D]'
                  }`}
                >
                  {s === '' ? 'Semua' : statusColors[s as keyof typeof statusColors]?.label || s}
                </button>
              ))}
              <button onClick={loadMyBookings} className="ml-auto p-1.5 rounded-lg hover:bg-gray-200 transition">
                <RefreshCw size={14} className="text-gray-500" />
              </button>
            </div>

            {bookingsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#1B365D] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : myBookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-400">
                <ListOrdered size={40} className="mx-auto mb-2 opacity-40" />
                <p>Belum ada booking</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onViewTicket={() => setTicketBooking(booking)}
                    onCancel={() => handleCancel(booking.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedSlotForForm && (
        <BookingFormModal
          selectedDate={selectedDate}
          selectedSlot={selectedSlotForForm}
          onClose={() => setSelectedSlotForForm(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
      {ticketBooking && (
        <BookingTicketModal
          booking={ticketBooking}
          onClose={() => setTicketBooking(null)}
        />
      )}
    </div>
  );
}

// ---- Sub-components ----

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
        active
          ? 'bg-[#1B365D] text-white shadow-md'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1B365D] hover:text-[#1B365D]'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function SlotCard({
  item,
  onClick,
}: {
  item: SlotAvailability['slots'][0];
  onClick: () => void;
}) {
  const pct = item.sisa_kuota / item.kuota_maksimal;
  const colorBar = pct === 0 ? 'bg-gray-300' : pct <= 0.3 ? 'bg-amber-400' : 'bg-emerald-400';

  return (
    <button
      onClick={onClick}
      disabled={!item.tersedia}
      className={`relative p-3 rounded-xl border text-left transition-all group ${
        item.tersedia
          ? 'border-gray-200 hover:border-[#1B365D] hover:shadow-md cursor-pointer'
          : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center gap-1 mb-2">
        <Clock size={12} className="text-gray-400" />
        <span className="text-xs font-medium text-gray-700">
          {formatTime(item.slot.jam_mulai)}
        </span>
      </div>
      <div className={`text-sm font-bold ${item.tersedia ? 'text-[#1B365D]' : 'text-gray-400'}`}>
        {item.sisa_kuota}/{item.kuota_maksimal}
      </div>
      <p className="text-xs text-gray-400 mt-0.5">{item.tersedia ? 'Tersedia' : 'Penuh'}</p>
      {/* Quota bar */}
      <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${colorBar}`}
          style={{ width: `${(item.sisa_kuota / item.kuota_maksimal) * 100}%` }}
        />
      </div>
    </button>
  );
}

function CalendarGrid({
  month,
  selectedDate,
  onSelect,
}: {
  month: Date;
  selectedDate: string;
  onSelect: (date: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = month.getFullYear();
  const mon = month.getMonth();

  const firstDay = new Date(year, mon, 1).getDay();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = `${year}-${String(mon + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const date = new Date(year, mon, day);
          const isPast = date < today;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={i}
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={`w-full aspect-square text-xs rounded-lg transition-all font-medium ${
                isSelected
                  ? 'bg-[#1B365D] text-white'
                  : isPast
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'hover:bg-[#1B365D]/10 text-gray-700'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingCard({
  booking,
  onViewTicket,
  onCancel,
}: {
  booking: Booking;
  onViewTicket: () => void;
  onCancel: () => void;
}) {
  const badge = statusColors[booking.status];
  const actionAllowed = isActionAllowed(booking);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Left: Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          <span className="text-xs text-gray-400">#{booking.id}</span>
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs font-medium text-gray-600">{booking.nomor_po}</span>
        </div>

        <p className="font-semibold text-gray-800 text-sm">
          {formatDate(booking.tanggal_booking)}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {formatTime(booking.time_slot?.jam_mulai)}–{formatTime(booking.time_slot?.jam_selesai)}
          </span>
          <span className="flex items-center gap-1">
            <Package size={11} />
            {booking.loading_dock?.nama_dock}
          </span>
          <span className="flex items-center gap-1">
            <Truck size={11} />
            {booking.plat_nomor_truk} · {booking.jenis_armada}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onViewTicket}
          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D]/5 transition"
        >
          Lihat Tiket
        </button>
        {actionAllowed && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
          >
            Batalkan
          </button>
        )}
      </div>
    </div>
  );
}
