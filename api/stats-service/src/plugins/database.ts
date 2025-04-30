import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize';
import sequelize from '../config/database';

async function databasePlugin(fastify: any) {
  const maxRetries = 5;
  const retryDelay = 5000; // 2 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected successfully');
      break;
    } catch (error) {
      console.error(`❌ Unable to connect to the database (Attempt ${attempt}/${maxRetries}):`);
      if (attempt === maxRetries) {
        console.error(error);
      }
      console.log(`Retrying in ${retryDelay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  fastify.decorate('db', sequelize);
}

export default fp(databasePlugin);
