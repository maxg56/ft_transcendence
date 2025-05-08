import redis from '../config/client';

const ONLINE_SET = 'online_users';

export async function setUserOnline(userId: string) {
  await redis.sadd(ONLINE_SET, userId);
}

export async function setUserOffline(userId: string) {
  await redis.srem(ONLINE_SET, userId);
}

export async function getOnlineStatus(userIds: string[]): Promise<Record<string, boolean>> {
  if (!userIds.length) return {};
  const statuses = await redis.smismember(ONLINE_SET, ...userIds);
  const result: Record<string, boolean> = {};
  userIds.forEach((id, i) => {
    result[id] = !!statuses[i];
  });
  return result;
}
