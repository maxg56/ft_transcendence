import redis from '../config/client';
import {logError , logformat} from "../utils/log"

const ONLINE_SET = 'online';


export async function setUserOnline(userId: string) {
  try {
    await redis.sadd(ONLINE_SET, userId);
    await  redis.smismember(ONLINE_SET, userId).then((result) => {
      if (result[0]) {
        logformat(`User ${userId} is already online`);
      } else {
        logError(`User ${userId} is now online`);
      }
    });
  } catch (err) {
    logError(`Failed to set user online: ${userId}`, err);
  }
}


export async function setUserOffline(userId: string) {
  try {
    await redis.srem(ONLINE_SET, userId);
    logformat(`User ${userId} is offline`);
  } catch (err) {
    logError(`Failed to set user offline: ${userId}`, err);
  }
}
