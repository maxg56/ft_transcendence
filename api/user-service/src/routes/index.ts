import fp from 'fastify-plugin'
import {putUser, getUser} from '../controllers/userControllers'
import { getRank } from '../controllers/getRank';
import { addFriend } from '../controllers/addFriend';
import { getAllUsernames } from '../controllers/getAllUsernames';


async function userRoutes(fastify: any) {
  fastify.put('/user/:id', putUser);
  fastify.get('/user/:id', getUser);
  fastify.get('/user/:id/rank', getRank);
  fastify.get('/user/users', getAllUsernames);
  fastify.post('/user/:id/friend', addFriend);
}

export default fp(userRoutes);