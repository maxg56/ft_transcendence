import Fastify from 'fastify';
import dotenv from 'dotenv';
import database from './plugins/database';
import statsRoutes from './routes/routes';
import User from './models/User';
import auth from './plugins/auth';
import Match from './models/Match';
import MatchPlayer from './models/MatchPlayer';

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT_STATS || 3000;

// Plugins
fastify.register(database);
fastify.register(auth);
// Plugin-routes
fastify.register(statsRoutes);



fastify.ready().then(() => {
	console.log("📌 Fastify is ready, initializing models...");
	console.log("✅ User model loaded:", !!User);
	console.log("✅ Match model loaded:", !!Match);
	console.log("✅ MatchPlayer model loaded:", !!MatchPlayer);	
});

// Démarrage du serveur
const start = async () => {
	try {
	await fastify.listen({ port: Number(PORT), host: '0.0.0.0' });
	console.log(`Stats Service launched on http://localhost:${PORT}`);
	} catch (err) {
	fastify.log.error(err);
	process.exit(1);
	}
};

start();