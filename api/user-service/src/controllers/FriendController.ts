import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';
import User from '../models/User';
import redis from '../config/client';
import {apiError, apiSuccess } from "../utils/apiResponse";
import { hasId } from '../utils/hasId';

const ONLINE_SET = 'online';

export async function getFriendStatus(req: FastifyRequest, reply: FastifyReply) {
  const value: string | object | Buffer = req.user;
  let userId: number | null = null;

  if (hasId(value)) {
    const rawId = value.id;
    userId = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;
  }

  if (typeof userId !== 'number' || isNaN(userId)) {
    return reply.send(apiError('Invalid user ID', 400));
  }

  try {
    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [{ user1: userId }, { user2: userId }],
        status: 'accepted',
      },
      include: [
        {
          model: User,
          as: 'userOne',
          attributes: ['id', 'username', 'avatar'],
        },
        {
          model: User,
          as: 'userTwo',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });

    const friends = [];

    for (const friendship of friendships) {
      const userOne = friendship.userOne;
      const userTwo = friendship.userTwo;

      if (!userOne || !userTwo) continue;

      const friend = userOne.id === userId ? userTwo : userOne;

      const [isOnline] = await redis.smismember(ONLINE_SET, friend.id);

      friends.push({
        id: friend.id,
        username: friend.username,
        avatar: friend.avatar,
        online: isOnline === 1,
      });
    }

    reply.send(apiSuccess({ friends }));
  } catch (err) {
    reply.status(500).send(apiError('Erreur lors de la récupération du statut des amis', 500));
  }
}

