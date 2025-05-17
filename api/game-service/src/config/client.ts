// redis.ts
import Redis from 'ioredis';
import { logError, logformat } from '../utils/log';

const redis = new Redis({
  host: 'redis', 
  port: 6379,
});

redis.on('connect', () => {
  logformat('✅ Connected to Redis');
});

redis.on('error', (err) => {
  logError('❌ Redis error:', err);
});

export default redis;
