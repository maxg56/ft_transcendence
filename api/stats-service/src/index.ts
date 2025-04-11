import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT_GAME || 3000;

fastify.post('/game', async (request, reply) => {
  return { message: 'Nouvelle partie créée' };
});
  
fastify.get('/game/:id', async (request, reply) => {
  return { message: `État de la partie ${request.params.id}` };
});

fastify.post('/game/:id/move', async (request, reply) => {
  return { message: `Coup enregistré pour la partie ${request.params.id}` };
});

const start = async () => {
    try {
      await fastify.listen({ port: Number(PORT), host: '0.0.0.0' });
      console.log(`Auth Service lancé sur http://localhost:${PORT}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };
  
  start();