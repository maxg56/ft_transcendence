import { FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcryptjs';
import  User  from '../models/User';

async function login_controller(username: string, password: string, reply: FastifyReply) {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const token = await reply.jwtSign({ username: user.username, id: user.id });
    return reply.send({ token });
} 

export default {
  async login(req: FastifyRequest<{ Body: { username: string; password: string } }>, reply: FastifyReply) {
    const { username, password } = req.body;
    return await login_controller(username, password, reply);
  },

  async register(req: FastifyRequest<{ Body: { username: string; email: string; password: string } }>, reply: FastifyReply) {
    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return reply.status(400).send({ error: 'Username already taken' });
      }

      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return reply.status(400).send({ error: 'Email already in use' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword });
      console.log('📌 New user registered:', user.username);
      return await login_controller(username, password, reply);
    } 
    catch (err) {
      return reply.status(500).send({ error: 'Error during registration' });
    }
  }
};
