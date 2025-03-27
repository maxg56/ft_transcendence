import Fastify from 'fastify';
import fastifyFormBody from '@fastify/formbody';
import dotenv from 'dotenv';
import routes from './routes/index';
import database from './plugins/database';
import auth from './plugins/auth';
import User from './models/User';

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT_AUTH || 3000;
// Plugins
fastify.register(fastifyFormBody); // Pour les requêtes x-www-form-urlencoded
fastify.register(database);
fastify.register(auth);

// Routes
fastify.register(routes);

fastify.ready().then(() => {
  console.log("📌 Fastify is ready, initializing models...");
  console.log("✅ User model loaded:", !!User);
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
