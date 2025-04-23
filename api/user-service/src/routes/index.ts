import fp from 'fastify-plugin'
import {putUser, getUser} from '../controllers/userControllers'
import { getRank } from '../controllers/getRank';
import { addFriend, acceptFriend, refuseFriend } from '../controllers/friends';
import { seeFriendRequests, seeFriends } from '../controllers/friendsLists';
import { getAllUsernames } from '../controllers/getAllUsernames';

async function userRoutes(fastify: any) {
  fastify.put('/user/:id', putUser);
  fastify.get('/user/:id', getUser);
  fastify.get('/user/:id/rank', getRank);
  fastify.get('/user/users', getAllUsernames);
  fastify.post('/user/friend/add', { preHandler: [fastify.authenticate] }, addFriend);
  fastify.put('/user/friend/accept', { preHandler: [fastify.authenticate] }, acceptFriend);
  fastify.put('/user/friend/refuse', { preHandler: [fastify.authenticate] }, refuseFriend);
  fastify.get('/user/friend/pendinglist', { preHandler: [fastify.authenticate] }, seeFriendRequests);
  fastify.get('/user/friend/list', { preHandler: [fastify.authenticate] }, seeFriends);
}



export default fp(userRoutes);