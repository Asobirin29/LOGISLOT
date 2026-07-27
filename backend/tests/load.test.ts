import request from 'supertest';
import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../src/prisma';
import express from 'express';
import bookingRoutes from '../src/routes/booking.routes';
import { getEarliestBookableDate } from '../src/utils/time';
import { performance } from 'perf_hooks';

const app = express();
app.use(express.json());

jest.mock('uuid', () => ({
  v4: () => '123e4567-e89b-12d3-a456-426614174000',
  validate: (str: string) => str === '123e4567-e89b-12d3-a456-426614174000'
}));

jest.mock('../src/utils/socket', () => ({
  broadcastBookingChanged: jest.fn(),
  broadcastDockChanged: jest.fn()
}));

app.use('/api/bookings', (req: any, res, next) => {
  req.user = { id: 1, role: 'supplier' };
  next();
}, bookingRoutes);



describe('Load / Stress Test', () => {
  const TOTAL_REQUESTS = 200; // Simulated 200 bookings per day
  let dockId: number;
  let slotId: number;
  let supplierId: number;
  let bookingDate: string;

  beforeAll(async () => {
    jest.setTimeout(60000); // 1 minute timeout for load test
    
    // Setup mock data
    await prisma.users.deleteMany({ where: { email: 'load@test.com' } });
    const supplier = await prisma.users.create({
      data: { nama: 'Load Tester', email: 'load@test.com', password_hash: 'hash', role: 'supplier', nama_instansi: 'Test Corp' }
    });
    supplierId = supplier.id;

    await prisma.loading_docks.deleteMany({ where: { nama_dock: 'Load Dock' } });
    const dock = await prisma.loading_docks.create({
      data: { nama_dock: 'Load Dock', kapasitas_maksimal: 200, status: 'active' }
    });
    dockId = dock.id;

    await prisma.time_slots.deleteMany({ where: { jam_mulai: new Date('1970-01-01T22:00:00Z') }});
    const slot = await prisma.time_slots.create({
      data: { jam_mulai: new Date('1970-01-01T22:00:00Z'), jam_selesai: new Date('1970-01-01T22:59:00Z'), kuota_maksimal: 500 } // Enough quota for all
    });
    slotId = slot.id;

    bookingDate = getEarliestBookableDate().toISOString().split('T')[0];

    await prisma.bookings.deleteMany({
      where: { loading_dock_id: dockId, time_slot_id: slotId, tanggal_booking: new Date(bookingDate) }
    });
  });

  afterAll(async () => {
    await prisma.bookings.deleteMany({ where: { time_slot_id: slotId } });
    await prisma.time_slots.delete({ where: { id: slotId } });
    await prisma.loading_docks.delete({ where: { id: dockId } });
    await prisma.users.delete({ where: { id: supplierId } });
    await prisma.$disconnect();
  });

  it('should process 200 booking requests with average latency < 200ms', async () => {
    let totalLatency = 0;
    const promises = [];

    for (let i = 0; i < TOTAL_REQUESTS; i++) {
      const start = performance.now();
      
      const p = request(app)
        .post('/api/bookings')
        .send({
          loading_dock_id: dockId,
          time_slot_id: slotId,
          tanggal_booking: bookingDate,
          nomor_po: `PO-LOAD-${i}`,
          plat_nomor_truk: `B ${1000 + (i % 9000)} XYZ`,
          nama_sopir: `Sopir ${i}`,
          jenis_armada: 'engkel'
        })
        .then((res) => {
          const end = performance.now();
          const latency = end - start;
          totalLatency += latency;
          return { status: res.status, latency };
        });
        
      promises.push(p);
    }

    const results = await Promise.all(promises);
    
    let successes = 0;
    results.forEach(r => {
      if(r.status === 201) successes++;
    });

    const averageLatency = totalLatency / TOTAL_REQUESTS;
    
    console.log(`\n[Load Test Results]`);
    console.log(`- Total Requests: ${TOTAL_REQUESTS}`);
    console.log(`- Successful Bookings: ${successes}`);
    console.log(`- Average API Latency: ${averageLatency.toFixed(2)} ms`);
    console.log(`- SLA Target: < 200 ms`);
    
    expect(successes).toBe(TOTAL_REQUESTS);
    expect(averageLatency).toBeLessThan(200);
  });
});
