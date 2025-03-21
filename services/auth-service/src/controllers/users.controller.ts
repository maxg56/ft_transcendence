import { FastifyReply, FastifyRequest } from 'fastify';
import UsersService from '../services/users.service';

export default {
  async getAllUsers(req: FastifyRequest, reply: FastifyReply) {
    const users = await UsersService.getAll();
    return reply.send(users);
  },

  async getUserById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = req.params;
    const user = await UsersService.getById(id);
    return reply.send(user);
  }
};
