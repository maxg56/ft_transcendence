import fp from 'fastify-plugin'
import {updateUser, getUser} from '../controllers/userControllers'
import { getElo } from '../controllers/getRank';
import { addFriend, acceptFriend, refuseFriend } from '../controllers/friends';
import { getFriendsList, seeFriendRequests } from '../controllers/friendsLists';
import { getAllUsernames } from '../controllers/getAllUsernames';
import { deleteUser } from '../controllers/deleteUser';

async function userRoutes(fastify: any) {
  fastify.put('/user/update', { preHandler: [fastify.authenticate] }, updateUser);
  fastify.get('/user/info', { preHandler: [fastify.authenticate] }, getUser);
  fastify.get('/user/elo', { preHandler: [fastify.authenticate] }, getElo);
  fastify.get('/user/users', { preHandler: [fastify.authenticate] }, getAllUsernames);
  fastify.post('/user/friend/add', { preHandler: [fastify.authenticate] }, addFriend);
  fastify.put('/user/friend/accept', { preHandler: [fastify.authenticate] }, acceptFriend);
  fastify.put('/user/friend/refuse', { preHandler: [fastify.authenticate] }, refuseFriend);
  fastify.get('/user/friend/pendinglist', { preHandler: [fastify.authenticate] }, seeFriendRequests);
  fastify.get('/user/friend/list', { preHandler: [fastify.authenticate] }, getFriendsList);
  fastify.put('/user/delete', { preHandler: [fastify.authenticate] }, deleteUser)
}



export default fp(userRoutes);