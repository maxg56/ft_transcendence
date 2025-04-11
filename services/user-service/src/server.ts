import Fastify from 'fastify';
import dotenv from 'dotenv';
import database from './plugins/database';
import userRoutes from './routes/index';
import User from './models/User';

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT_USER || 3000;

// Plugins
fastify.register(database);
fastify.register(userRoutes);

 

// fastify.get('/user/:id', async (request, reply) => {
// 	return { message: `Détails de l'utilisateur ${request.params.id}` };
//   });
  
//   fastify.put('/user/:id', async (request, reply) => {
// 	return { message: `Mise à jour du profil de l'utilisateur ${request.params.id}` };
//   }); 

  

fastify.ready().then(() => {
	console.log("📌 Fastify is ready, initializing models...");
	console.log("✅ User model loaded:", !!User);
	// fastify.printRoutes();
});

// Démarrage du serveur
const start = async () => {
	try {
	await fastify.listen({ port: Number(PORT), host: '0.0.0.0' });
	console.log(`User Service lancé sur http://localhost:${PORT}`);
	} catch (err) {
	fastify.log.error(err);
	process.exit(1);
	}
};

start();