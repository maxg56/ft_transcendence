import fp from 'fastify-plugin';
import FastifyJwt from '@fastify/jwt';
import { apiError } from "../utils/apiResponse";

export default fp(async function (fastify) {
  fastify.register(FastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    sign: {
      expiresIn: '1h',
    },
  });
 

  fastify.decorate('authenticate', async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send(apiError('Token is invalid or expired', 401));
    }
  });
});
