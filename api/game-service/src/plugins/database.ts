import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize';
import sequelize from '../config/database';
import { logError, logformat } from '../utils/log';

async function databasePlugin(fastify: any) {
  const maxRetries = 5;
  const retryDelay = 5000; // 2 seconds

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.authenticate();
      logformat('✅ Database connected successfully');
      break;
    } catch (error) {
      logError(`❌ Unable to connect to the database (Attempt ${attempt}/${maxRetries}):`);
      if (attempt === maxRetries) {
        console.error(error);
      }
      logformat(`Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  fastify.decorate('db', sequelize);
}

export default fp(databasePlugin);
