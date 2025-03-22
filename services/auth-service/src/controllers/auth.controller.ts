import { FastifyReply, FastifyRequest } from 'fastify';

export default {
  async login(req: FastifyRequest<{ Body: { username: string; password: string } }>, reply: FastifyReply) {
    const { username, password } = req.body;

    // Simuler un utilisateur en base de données
    if (username === 'admin' && password === 'password') {
      const token = await reply.jwtSign({ username });
      return reply.send({ token });
    }

    return reply.code(401).send({ error: 'Invalid credentials' });
  }
};
