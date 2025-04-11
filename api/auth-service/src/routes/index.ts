import { FastifyInstance } from 'fastify';
import AuthController from '../controllers/auth.controller';

export default async function (fastify: FastifyInstance) {
  fastify.post('/auth/login',  AuthController.login);
  fastify.post('/auth/register', AuthController.register);
  fastify.get("/auth/profile", { preHandler: [fastify.authenticate] }, async (request: any, reply) => {
    return request.user;
  });
  
  
}
