import { PrismaClient, Role, LoadingDockStatus, BookingStatus, EventType } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const adapter = new PrismaMariaDb({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'logislot',
  port: 3306,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // Hash the default password for all seed users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // Reset database tables in correct order to avoid Foreign Key violations
  await prisma.tracking_logs.deleteMany();
  await prisma.bookings.deleteMany();
  await prisma.loading_docks.deleteMany();
  await prisma.time_slots.deleteMany();

  // 1. Create 5 Users (One for each role)
  const users = await Promise.all([
    prisma.users.upsert({
      where: { email: 'supplier@logislot.com' },
      update: { password_hash: hashedPassword, is_active: true },
      create: {
        nama: 'Supplier Budi',
        email: 'supplier@logislot.com',
        password_hash: hashedPassword,
        nama_instansi: 'PT Pemasok Sukses',
        role: Role.supplier,
      },
    }),
    prisma.users.upsert({
      where: { email: 'ic@logislot.com' },
      update: { password_hash: hashedPassword, is_active: true },
      create: {
        nama: 'IC Clara',
        email: 'ic@logislot.com',
        password_hash: hashedPassword,
        nama_instansi: 'Gudang Utama',
        role: Role.ic,
      },
    }),
    prisma.users.upsert({
      where: { email: 'security@logislot.com' },
      update: { password_hash: hashedPassword, is_active: true },
      create: {
        nama: 'Security Danu',
        email: 'security@logislot.com',
        password_hash: hashedPassword,
        nama_instansi: 'Gudang Utama',
        role: Role.security,
      },
    }),
    prisma.users.upsert({
      where: { email: 'warehouse@logislot.com' },
      update: { password_hash: hashedPassword, is_active: true },
      create: {
        nama: 'Warehouse Eko',
        email: 'warehouse@logislot.com',
        password_hash: hashedPassword,
        nama_instansi: 'Gudang Utama',
        role: Role.warehouse,
      },
    }),
    prisma.users.upsert({
      where: { email: 'admin@logislot.com' },
      update: { password_hash: hashedPassword, is_active: true },
      create: {
        nama: 'Admin Fajar',
        email: 'admin@logislot.com',
        password_hash: hashedPassword,
        nama_instansi: 'Gudang Utama',
        role: Role.admin,
      },
    }),
  ]);
  console.log(`Created ${users.length} users.`);

  // 2. Create 3 Loading Docks
  const docksData = [
    { nama_dock: 'Dock A - Raw Material', deskripsi: 'Untuk bahan mentah', kapasitas_maksimal: 1, status: LoadingDockStatus.active },
    { nama_dock: 'Dock B - Packaging', deskripsi: 'Untuk kardus dan plastik', kapasitas_maksimal: 1, status: LoadingDockStatus.active },
    { nama_dock: 'Dock C - Spareparts', deskripsi: 'Untuk suku cadang mesin', kapasitas_maksimal: 1, status: LoadingDockStatus.maintenance },
  ];

  const docks = await Promise.all(
    docksData.map((d) => prisma.loading_docks.create({ data: d }))
  );
  console.log(`Created ${docks.length} loading docks.`);

  // 3. Create 8 Time Slots (07:00 - 15:00) per 1 hour, quota 5
  const timeSlotsData = [];
  for (let i = 7; i <= 14; i++) {
    timeSlotsData.push({
      jam_mulai: new Date(`1970-01-01T${i.toString().padStart(2, '0')}:00:00Z`),
      jam_selesai: new Date(`1970-01-01T${(i + 1).toString().padStart(2, '0')}:00:00Z`),
      kuota_maksimal: 5,
    });
  }
  const timeSlots = await Promise.all(
    timeSlotsData.map((t) => prisma.time_slots.create({ data: t }))
  );
  console.log(`Created ${timeSlots.length} time slots.`);

  // 4. Create 10 Bookings with diverse statuses
  const supplierId = users[0].id;
  const securityId = users[2].id;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookingsData = [];
  const statuses = [
    BookingStatus.booked, BookingStatus.arrived, BookingStatus.unloading,
    BookingStatus.completed, BookingStatus.cancelled, BookingStatus.booked,
    BookingStatus.completed, BookingStatus.arrived, BookingStatus.booked, BookingStatus.unloading
  ];

  for (let i = 0; i < 10; i++) {
    const status = statuses[i];
    bookingsData.push({
      user_id: supplierId,
      loading_dock_id: docks[i % 2].id, // Alternate Dock A and Dock B
      time_slot_id: timeSlots[i % 8].id,
      tanggal_booking: today,
      nomor_po: `PO-${1000 + i}`,
      plat_nomor_truk: `B ${1234 + i} XYZ`,
      nama_sopir: `Sopir ${i + 1}`,
      jenis_armada: i % 2 === 0 ? 'Fuso' : 'Colt Diesel',
      status: status,
      kode_qr: crypto.randomUUID(),
    });
  }

  const createdBookings = await Promise.all(
    bookingsData.map((b) => prisma.bookings.create({ data: b }))
  );
  console.log(`Created ${createdBookings.length} bookings.`);

  // 5. Create tracking logs for bookings that are not just 'booked' or 'cancelled'
  const trackingLogsData = [];
  for (const booking of createdBookings) {
    if (booking.status !== BookingStatus.booked && booking.status !== BookingStatus.cancelled) {
      // arrived_at_gate
      trackingLogsData.push({
        booking_id: booking.id,
        event_type: EventType.arrived_at_gate,
        reported_by_user_id: securityId,
        catatan: 'Truk tiba tepat waktu',
      });

      if (booking.status === BookingStatus.unloading || booking.status === BookingStatus.completed) {
        trackingLogsData.push({
          booking_id: booking.id,
          event_type: EventType.start_unloading,
          reported_by_user_id: users[3].id, // warehouse
          catatan: 'Mulai proses bongkar',
        });
      }

      if (booking.status === BookingStatus.completed) {
        trackingLogsData.push({
          booking_id: booking.id,
          event_type: EventType.finish_unloading,
          reported_by_user_id: users[3].id, // warehouse
          catatan: 'Bongkar muat selesai',
        });
        trackingLogsData.push({
          booking_id: booking.id,
          event_type: EventType.checked_out,
          reported_by_user_id: securityId, // security
          catatan: 'Truk keluar gerbang',
        });
      }
    }
  }

  const logs = await Promise.all(
    trackingLogsData.map((l) => prisma.tracking_logs.create({ data: l }))
  );
  console.log(`Created ${logs.length} tracking logs.`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
