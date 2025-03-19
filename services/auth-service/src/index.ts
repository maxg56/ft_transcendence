import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT_AUTH || 3000;

// Définition des routes
fastify.post('/auth/login', async (request, reply) => {
  return { message: 'Authentification réussie' };
});

fastify.post('/auth/register', async (request, reply) => {
  return { message: 'Utilisateur enregistré' };
});

fastify.get('/auth/profile', async (request, reply) => {
  return { message: 'Informations du profil' };
});

fastify.get('/', async (request, reply) => {
  return { message: 'Informations du profil' };
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
