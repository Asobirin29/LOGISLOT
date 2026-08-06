'use client';

import { useState } from 'react';
import DriverTourButton from '@/components/DriverTourButton';
import toast from 'react-hot-toast';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Supplier',
    q: 'Bagaimana cara membatalkan atau mengubah jadwal booking slot?',
    a: 'Anda dapat membatalkan atau me-reschedule booking dari menu "My Bookings" setidaknya 4 jam sebelum jam slot dimulai. Klik tombol opsi pada baris booking yang bersangkutan.'
  },
  {
    category: 'Supplier',
    q: 'Apa yang harus dibawa sopir saat tiba di pintu gerbang pabrik?',
    a: 'Sopir wajib menunjukkan QR Tiket Booking (baik cetak fisik maupun tampilan layar smartphone) serta Surat Jalan / Purchase Order (PO) yang sah kepada petugas Security.'
  },
  {
    category: 'Security',
    q: 'Bagaimana jika QR Code tiket tidak dapat di-scan di gerbang?',
    a: 'Gunakan fitur pencarian manual dengan mengetikkan Nomor PO atau Nomor Plat Truk pada form Check-In Security.'
  },
  {
    category: 'Warehouse',
    q: 'Apa yang dilakukan jika terjadi penumpukan truk di loading dock?',
    a: 'Petugas Gudang dapat mengubah status Dock di menu "Denah Loading Dock" atau mengalihkan alokasi armada ke dock lain yang sedang kosong.'
  },
  {
    category: 'Umum',
    q: 'Bagaimana cara menghubungi Helpdesk LogisSlot jika sistem error?',
    a: 'Anda dapat mengirimkan tiket bantuan melalui tombol "Kirim Tiket Bantuan" di bawah ini atau menghubungi hotline WhatsApp Support (0811-LOGISLOT).'
  }
];

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  // Ticket Modal State
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subjek: '',
    kategori: 'Teknis System Error',
    deskripsi: '',
  });
  const [sending, setSending] = useState(false);

  const categories = ['All', 'Supplier', 'Security', 'Warehouse', 'Umum'];

  const filteredFaqs = FAQS.filter(
    (f) => activeCategory === 'All' || f.category === activeCategory
  );

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subjek.trim() || !ticketForm.deskripsi.trim()) {
      toast.error('Mohon isi subjek dan deskripsi Kendala secara lengkap.');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setIsTicketOpen(false);
      setTicketForm({ subjek: '', kategori: 'Teknis System Error', deskripsi: '' });
      toast.success('Tiket bantuan Anda berhasil terkirim! Tim IT Support akan segera merespons.');
    }, 700);
  };

  return (
    <div className="space-y-6 pb-12" data-tour="support-faq">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-[#1B365D]">Pusat Bantuan & Dukungan Operasional</h1>
          <p className="text-gray-500 text-sm mt-1">
            Panduan penggunaan, Tanya Jawab (FAQ), dan layanan bantuan teknis LogisSlot.
          </p>
        </div>
        <div className="flex items-center gap-3" data-tour="support-ticket-btn">
          <button
            onClick={() => setIsTicketOpen(true)}
            className="inline-flex items-center gap-2 bg-[#1B365D] hover:bg-[#2A4874] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
            <span>Kirim Tiket Bantuan</span>
          </button>
        </div>
      </div>

      {/* Quick Tour Banner */}
      <div className="bg-[#1B365D] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400">explore</span>
            Butuh Panduan Interaktif Penggunaan Halaman?
          </h2>
          <p className="text-sm text-gray-200">
            Jalankan tur interaktif (Driver.js) untuk memandu Anda langkah demi langkah memahami setiap fitur.
          </p>
        </div>
        <DriverTourButton variant="button" />
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1B365D]">quiz</span>
            Pertanyaan Sering Diajukan (FAQ)
          </h2>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#1B365D] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 bg-white hover:bg-gray-50 flex items-center justify-between gap-4 font-semibold text-gray-800 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-bold text-[11px]">
                      {faq.category}
                    </span>
                    {faq.q}
                  </span>
                  <span className={`material-symbols-outlined transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">call</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Hotline Support</p>
            <p className="text-sm font-extrabold text-gray-800">0811-LOGISLOT (564475)</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">mail</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Email Helpdesk</p>
            <p className="text-sm font-extrabold text-gray-800">support@logisslot.com</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Jam Layanan IT</p>
            <p className="text-sm font-extrabold text-gray-800">24 / 7 Live Monitoring</p>
          </div>
        </div>
      </div>

      {/* Support Ticket Modal */}
      {isTicketOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-xl font-bold text-[#1B365D]">Kirim Tiket Bantuan</h3>
                <p className="text-xs text-gray-500">Isi formulir berikut untuk melaporkan kendala teknis atau pertanyaan.</p>
              </div>
              <button onClick={() => setIsTicketOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSendTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Kategori Bantuan *</label>
                <select
                  value={ticketForm.kategori}
                  onChange={(e) => setTicketForm({ ...ticketForm, kategori: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                >
                  <option value="Teknis System Error">Teknis System Error / Bug</option>
                  <option value="Kendala Gagal Booking">Kendala Gagal Booking</option>
                  <option value="Perbedaan Data PO">Perbedaan Data PO / QR Code</option>
                  <option value="Permintaan Fitur Baru">Permintaan Fitur Baru</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Subjek Masalah *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: QR Code tidak dapat di-scan di gerbang"
                  value={ticketForm.subjek}
                  onChange={(e) => setTicketForm({ ...ticketForm, subjek: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Deskripsi Lengkap *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan kronologi kendala beserta nomor PO atau nomor plat jika ada..."
                  value={ticketForm.deskripsi}
                  onChange={(e) => setTicketForm({ ...ticketForm, deskripsi: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:ring-2 focus:ring-[#1B365D] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsTicketOpen(false)}
                  className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="py-2.5 px-5 bg-[#1B365D] hover:bg-[#2A4874] disabled:bg-gray-300 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
                >
                  {sending ? 'Mengirim...' : 'Kirim Tiket Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
