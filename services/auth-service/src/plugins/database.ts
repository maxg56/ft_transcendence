import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize';

async function databasePlugin(fastify: any) {
	const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT } = process.env;

	if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_DIALECT) {
		throw new Error("Missing required database environment variables");
	}

	const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
		host: DB_HOST,
		port: parseInt(DB_PORT, 10),
		dialect: DB_DIALECT as any, // TypeScript ne reconnaît pas les string literals pour Sequelize
		// logging: false, // Désactive les logs SQL pour alléger la console
	});

	try {
		await sequelize.authenticate();
		console.log('✅ Database connected successfully');
	} catch (error) {
		console.error('❌ Unable to connect to the database:', error);
	}

	fastify.decorate('db', sequelize);
}

export default fp(databasePlugin);
