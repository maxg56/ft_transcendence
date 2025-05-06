// src/presence/presenceManager.ts
import redis  from '../redis/client';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';
import User from '../models/User';

export async function setUserOnline(userId: string) {
  await redis.set(`online_users:${userId}`, '1');
}

export async function setUserOffline(userId: string) {
  await redis.del(`online_users:${userId}`);
}

export async function getFriendsOnlineStatus(friendIds: string[]){
    const id = friendIds[0];
    const friends = await Friendship.findAll({ where: { 
        [Op.or]: [
            { user1: id },
            { user2: id }],
        status: 'accepted'
    },
    include: [{
        model: User,
        as: 'userOne',
        attributes: ['username', 'avatar'],
    },
    {	model: User,
        as: 'userTwo',
        attributes: ['username', 'avatar'],
    }]});
  const keys = friendIds.map(id => `online_users:${id}`);
  const statuses = await redis.mget(keys);
  return friendIds.map((id, i) => ({ id, online: statuses[i] === '1' }));
}
