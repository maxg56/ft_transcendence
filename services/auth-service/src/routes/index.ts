import { FastifyInstance } from 'fastify';
import UsersController from '../controllers/users.controller';

export default async function (fastify: FastifyInstance) {
  fastify.get('/auth/profile', UsersController.getAllUsers);
  fastify.get('/users/:id', UsersController.getUserById);
}
