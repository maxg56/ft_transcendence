import { FastifyInstance } from 'fastify';
import AuthController from '../controllers/auth.controller';

export default async function (fastify: FastifyInstance) {
  fastify.post('/auth/login',  AuthController.login);
  fastify.post('/auth/register', AuthController.register);
  fastify.get('/auth/protected', { preHandler: [fastify.authenticate] }, async (req, reply) => {
    return { msg: 'You are authenticated!' };
  });
}
