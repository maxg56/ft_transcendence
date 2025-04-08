import fp from 'fastify-plugin'
import UserHandlers from '../handlers/userHandlers'

async function userRoutes(fastify: any) {
  fastify.put('/user/:id', UserHandlers.putUser);
  fastify.get('/user/:id', UserHandlers.getUser);
}

export default fp(userRoutes);