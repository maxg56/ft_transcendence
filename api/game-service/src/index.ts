import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT_USER || 3000;

fastify.get('/user/:id', async (request, reply) => {
    return { message: `Détails de l'utilisateur ${request.params.id}` };
  });
  
  fastify.put('/user/:id', async (request, reply) => {
    return { message: `Mise à jour du profil de l'utilisateur ${request.params.id}` };
  });

// Démarrage du serveur
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