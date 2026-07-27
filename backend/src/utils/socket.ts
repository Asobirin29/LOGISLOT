import { Server } from 'socket.io';
import http from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import redisClient from './redis';
import { verifyToken } from './jwt';

let io: Server | null = null;

export const initSocket = async (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true
    }
  });

  // Redis Adapter setup
  try {
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log('[Socket] Redis adapter attached');
  } catch (e) {
    console.error('[Socket] Failed to attach Redis adapter', e);
  }

  // Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }
    try {
      const payload = verifyToken(token as string);
      socket.data.user = payload;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`[Socket] User connected: ${socket.id}, User ID: ${user?.id}, Role: ${user?.role}`);

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    console.warn('Socket.io not initialized, emitting skipped');
    return null;
  }
  return io;
};

// Typed broadcasters
export const broadcastBookingChanged = (payload: {
  booking_id: number;
  plat_nomor_truk: string;
  status_lama: string | null;
  status_baru: string;
  loading_dock_id: number;
  timestamp: Date;
}) => {
  const socket = getIO();
  if (socket) {
    socket.emit('booking:status_changed', payload);
  }
};

export const broadcastDockChanged = (payload: {
  loading_dock_id: number;
  status: string;
}) => {
  const socket = getIO();
  if (socket) {
    socket.emit('dock:status_changed', payload);
  }
};
