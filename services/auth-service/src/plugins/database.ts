import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize';
import sequelize from '../config/database';

async function databasePlugin(fastify: any) {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }

  fastify.decorate('db', sequelize);
}

export default fp(databasePlugin);
