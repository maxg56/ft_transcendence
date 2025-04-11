import fp from 'fastify-plugin'
import {putUser, getUser} from '../controllers/userControllers'

async function userRoutes(fastify: any) {
  fastify.put('/user/:id', putUser);
  fastify.get('/user/:id', getUser);
}

export default fp(userRoutes);