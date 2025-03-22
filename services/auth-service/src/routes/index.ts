import { FastifyInstance } from 'fastify';
import UsersController from '../controllers/users.controller';
import AuthController from '../controllers/auth.controller';

export default async function (fastify: FastifyInstance) {
  fastify.post('/auth/login',  AuthController.login);
  fastify.post('/auth/register', UsersController.getUserById);
  fastify.get('/auth/profile', { preHandler: [fastify.authenticate] },UsersController.getAllUsers);
}
