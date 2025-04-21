import fp from 'fastify-plugin';
import FastifyJwt from '@fastify/jwt';

export default fp(async function (fastify) {
  fastify.register(FastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    sign: {
      // expiresIn: '1h',
    },
  });

  fastify.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
});
