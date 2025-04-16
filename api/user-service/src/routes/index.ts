import fp from 'fastify-plugin'
import {putUser, getUser} from '../controllers/userControllers'
import { getRank } from '../controllers/getRank';
import { addFriend, acceptFriend, seeFriendRequests, refuseFriend } from '../controllers/friend';

async function userRoutes(fastify: any) {
  fastify.put('/user/:id', putUser);
  fastify.get('/user/:id', getUser);
  fastify.get('/user/:id/rank', getRank);
  fastify.post('/user/:id/friend', addFriend);
  fastify.put('/user/friend/accept', { preHandler: [fastify.authenticate] }, acceptFriend);
  fastify.get('/user/friend/pendinglist', { preHandler: [fastify.authenticate] }, seeFriendRequests);
  fastify.put('/user/friend/refuse', { preHandler: [fastify.authenticate] }, refuseFriend);
}

export default fp(userRoutes);