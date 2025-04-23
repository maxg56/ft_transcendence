import fp from 'fastify-plugin'
import AuthController from '../controllers/auth.controller';
import { enable2FA } from '../controllers/enable-2fa';
import { verify2FA } from '../controllers/verify-2fa';


async function authRoutes(fastify: any) {
  fastify.post('/auth/login',  AuthController.login);
  fastify.post('/auth/register', AuthController.register);
  fastify.post('/auth/refresh' ,{ preHandler: [fastify.authenticate] }, AuthController.refresh);
  fastify.post('/auth/enable-2fa', { preHandler: [fastify.authenticate] }, enable2FA);
  fastify.post('/auth/verify-2fa', { preHandler: [fastify.authenticate] }, verify2FA);
}

export default fp(authRoutes);