import request from 'supertest';
import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../src/prisma';
import express from 'express';
import bookingRoutes from '../src/routes/booking.routes';
import { requireAuth } from '../src/middlewares/auth';
import { requireRole } from '../src/middlewares/role';
import { generateToken } from '../src/utils/jwt';
import { nowWIB, getEarliestBookableDate } from '../src/utils/time';

// Setup minimal app for testing
const app = express();
app.use(express.json());

// Mock socket to prevent initialization errors
jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
  validate: (str: string) => str === '123e4567-e89b-12d3-a456-426614174000'
}));

jest.mock('../src/utils/socket', () => ({
  broadcastBookingChanged: jest.fn(),
  broadcastDockChanged: jest.fn()
}));

// Mock auth middleware for supplier
app.use('/api/bookings', (req: any, res, next) => {
  // Inject mock user info directly to bypass JWT requirement in this specific test
  req.user = { id: 1, role: 'supplier' };
  next();
}, bookingRoutes);



describe('Concurrency Test: Booking Slot', () => {
  const TOTAL_REQUESTS = 50;
  const QUOTA = 5;
  
  let slotId: number;
  let dockId: number;
  let supplierId: number;
  let bookingDate: string;

  beforeAll(async () => {
    // 1. Create a dummy supplier
    await prisma.users.deleteMany({ where: { email: 'concurrency@test.com' } });
    const supplier = await prisma.users.create({
      data: {
        nama: 'Concurrency Tester',
        email: 'concurrency@test.com',
        password_hash: 'hash',
        role: 'supplier',
        nama_instansi: 'Test Corp'
      }
    });
    supplierId = supplier.id;

    // 2. Create a loading dock
    await prisma.loading_docks.deleteMany({ where: { nama_dock: 'Concurrency Dock' } });
    const dock = await prisma.loading_docks.create({
      data: {
        nama_dock: 'Concurrency Dock',
        kapasitas_maksimal: 10,
        status: 'active'
      }
    });
    dockId = dock.id;

    // 3. Create a time slot with exactly 5 quota
    // Clean up first just in case
    await prisma.time_slots.deleteMany({ where: { jam_mulai: new Date('1970-01-01T23:00:00Z') }});
    
    const slot = await prisma.time_slots.create({
      data: {
        jam_mulai: new Date('1970-01-01T23:00:00Z'),
        jam_selesai: new Date('1970-01-01T23:59:00Z'),
        kuota_maksimal: QUOTA
      }
    });
    slotId = slot.id;

    // 4. Set booking date to valid earliest date
    bookingDate = getEarliestBookableDate().toISOString().split('T')[0];

    // 5. Clean up any existing bookings for this dock/slot/date
    await prisma.bookings.deleteMany({
      where: {
        loading_dock_id: dockId,
        time_slot_id: slotId,
        tanggal_booking: new Date(bookingDate)
      }
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.bookings.deleteMany({ where: { time_slot_id: slotId } });
    await prisma.time_slots.delete({ where: { id: slotId } });
    await prisma.loading_docks.delete({ where: { id: dockId } });
    await prisma.users.delete({ where: { id: supplierId } });
    await prisma.$disconnect();
  });

  it('should only allow 5 bookings out of 50 concurrent requests', async () => {
    // Create 50 concurrent requests
    const promises = [];
    for (let i = 0; i < TOTAL_REQUESTS; i++) {
      promises.push(
        request(app)
          .post('/api/bookings')
          .send({
            loading_dock_id: dockId,
            time_slot_id: slotId,
            tanggal_booking: bookingDate,
            nomor_po: `PO-CONC-${i}`,
            plat_nomor_truk: `B ${1000 + i} XYZ`,
            nama_sopir: `Sopir ${i}`,
            jenis_armada: 'engkel'
          })
      );
    }

    const responses = await Promise.all(promises);

    let successCount = 0;
    let conflictCount = 0;

    responses.forEach(res => {
      if (res.status === 201) successCount++;
      else if (res.status === 409) conflictCount++;
      else console.log('Unexpected status:', res.status, res.body);
    });

    // Check assertions
    expect(successCount).toBe(QUOTA); // Exactly 5
    expect(conflictCount).toBe(TOTAL_REQUESTS - QUOTA); // Exactly 45

    // Verify database actually has exactly 5 bookings
    const dbCount = await prisma.bookings.count({
      where: {
        loading_dock_id: dockId,
        time_slot_id: slotId,
        tanggal_booking: new Date(bookingDate)
      }
    });

    expect(dbCount).toBe(QUOTA);
  });
});
