import fp from 'fastify-plugin'
import {putUser, getUser} from '../controllers/userControllers'
import { getRank } from '../controllers/getRank';
import { addFriend, acceptFriend, seeFriendRequests } from '../controllers/friend';

async function userRoutes(fastify: any) {
  fastify.put('/user/:id', putUser);
  fastify.get('/user/:id', getUser);
  fastify.get('/user/:id/rank', getRank);
  fastify.post('/user/:id/friend', addFriend);
  // fastify.put('/user/:id/friend/accept', acceptFriend)
  fastify.get('/user/:id/friend/pendinglist', seeFriendRequests)
}

export default fp(userRoutes);