import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin'
import User from '../models/User'


async function userRoutes(fastify: any) {
  fastify.get('/user/{id}', async (request: any, reply: any) => {
    try {
      const { id } = request.params;
      const user = await User.findByPk(id);

      if (!user) {
        return reply.code(404).send({message: 'user not find'});
      }

      return reply.send(user);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({message: 'server error'});
    }
  });
}

export default fp(userRoutes);