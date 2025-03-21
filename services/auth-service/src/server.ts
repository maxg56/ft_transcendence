import Fastify from 'fastify';
import dotenv from 'dotenv';
import routes from './routes/index';
import database from './plugins/database';

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT_AUTH || 3000;
// Plugins
fastify.register(database);

// Routes
fastify.register(routes);

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
