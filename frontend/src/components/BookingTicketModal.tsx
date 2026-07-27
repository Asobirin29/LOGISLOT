'use client';

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Printer } from 'lucide-react';
import { Booking, formatDate, formatTime, statusColors } from '../lib/booking';

interface BookingTicketModalProps {
  booking: Booking;
  onClose: () => void;
}

export default function BookingTicketModal({ booking, onClose }: BookingTicketModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');

    const canvas = await html2canvas(ticketRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`LOGISLOT-Booking-${booking.id}.pdf`);
  };

  const badge = statusColors[booking.status];
  const qrValue = JSON.stringify({
    booking_id: booking.id,
    kode_qr: booking.kode_qr,
    plat: booking.plat_nomor_truk,
    tanggal: booking.tanggal_booking,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b">
          <h2 className="text-lg font-bold text-[#1B365D]">Tiket Booking</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Ticket Content */}
        <div ref={ticketRef} className="px-6 py-5">
          {/* Header Logo */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-black text-[#1B365D] tracking-tight">LOGISLOT</p>
              <p className="text-xs text-gray-500">Platform Manajemen Truk</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          </div>

          {/* Divider with holes */}
          <div className="relative flex items-center my-4">
            <div className="absolute -left-8 w-6 h-6 bg-gray-100 rounded-full"></div>
            <div className="flex-1 border-t-2 border-dashed border-gray-200"></div>
            <div className="absolute -right-8 w-6 h-6 bg-gray-100 rounded-full"></div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="p-3 border-2 border-[#1B365D]/10 rounded-xl bg-gray-50">
              <QRCodeSVG
                value={qrValue}
                size={140}
                level="H"
                includeMargin={false}
                fgColor="#1B365D"
              />
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mb-5 font-mono">
            {booking.kode_qr}
          </p>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <DetailRow label="No. Booking" value={`#${booking.id}`} />
            <DetailRow label="No. PO" value={booking.nomor_po} />
            <DetailRow label="Tanggal" value={formatDate(booking.tanggal_booking)} span />
            <DetailRow label="Loading Dock" value={booking.loading_dock?.nama_dock} />
            <DetailRow
              label="Waktu"
              value={`${formatTime(booking.time_slot?.jam_mulai)} – ${formatTime(booking.time_slot?.jam_selesai)}`}
            />
            <DetailRow label="Plat Nomor" value={booking.plat_nomor_truk} />
            <DetailRow label="Nama Sopir" value={booking.nama_sopir} />
            <DetailRow label="Jenis Armada" value={booking.jenis_armada} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-5 pt-2 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 border border-[#1B365D] text-[#1B365D] py-2 rounded-lg hover:bg-[#1B365D]/5 transition font-medium text-sm"
          >
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1B365D] text-white py-2 rounded-lg hover:bg-[#1B365D]/90 transition font-medium text-sm"
          >
            <Download size={16} />
            Unduh PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, span }: { label: string; value?: string; span?: boolean }) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-gray-800 truncate">{value || '-'}</p>
    </div>
  );
}
