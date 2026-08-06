import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let errorLogged = false;

const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: false // Don't retry if Redis is not available
  }
});

redisClient.on('error', (err) => {
  if (!errorLogged) {
    console.log('[Redis] Not available - running without Redis (refresh tokens & socket adapter disabled)');
    errorLogged = true;
  }
});
redisClient.on('connect', () => console.log('[Redis] Connected'));

// Only connect once during app startup
export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.log('[Redis] Could not connect - continuing without Redis');
  }
};

export default redisClient;
