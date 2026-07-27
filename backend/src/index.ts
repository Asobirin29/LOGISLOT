import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
import cookieParser from 'cookie-parser';
import { connectRedis } from './utils/redis';
import { initSocket } from './utils/socket';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load Swagger Document
const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

import authRoutes from './routes/auth.routes';
import masterRoutes from './routes/master.routes';
import bookingRoutes from './routes/booking.routes';
import slotRoutes from './routes/slot.routes';
import icRoutes from './routes/ic.routes';
import reportRoutes from './routes/report.routes';
import gateRoutes from './routes/gate.routes';
import warehouseRoutes from './routes/warehouse.routes';
import adminRoutes from './routes/admin.routes';

// Basic Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'LOGISLOT API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/ic/bookings', icRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/gate', gateRoutes);
app.use('/api/warehouse', warehouseRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

connectRedis().then(async () => {
  await initSocket(server);
  server.listen(PORT, () => {
    console.log(`[Server] LOGISLOT Backend running on port ${PORT}`);
  });
}).catch(async (err) => {
  console.error('[Server] Failed to connect to Redis, but starting server anyway', err);
  await initSocket(server);
  server.listen(PORT, () => {
    console.log(`[Server] LOGISLOT Backend running on port ${PORT} (without Redis)`);
  });
});
