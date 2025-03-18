import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT_STATS || 3000;

fastify.get('/stats/:user_id', async (request, reply) => {
  return { message: `Statistiques de l'utilisateur ${request.params.user_id}` };
});

fastify.get('/leaderboard', async (request, reply) => {
  return { message: 'Classement des meilleurs joueurs' };
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