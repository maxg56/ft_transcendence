// src/ws/redisChat.ts
import redis from '../config/client';

const CHANNEL_GENERAL = 'general';

export async function addMessageToRedis(channel: string, message: any) {
  const key = `chat:${channel}`;
  await redis.lpush(key, JSON.stringify(message));
  await redis.ltrim(key, 0, 49); // Garder les 50 derniers messages
}

export async function getRecentMessages(channel: string): Promise<any[]> {
  const key = `chat:${channel}`;
  const messages = await redis.lrange(key, 0, 49);
  return messages.map((msg: string) => JSON.parse(msg)).reverse();
}

export { CHANNEL_GENERAL };
