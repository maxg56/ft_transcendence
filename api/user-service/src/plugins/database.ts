import fp from 'fastify-plugin';
import sequelize from '../config/database';
import Friendship from '../models/Friendship';

async function databasePlugin(fastify: any) {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    await Friendship.sync({ alter: true});
    console.log("✅ Friendship table synchronized")
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }

  fastify.decorate('db', sequelize);
}

export default fp(databasePlugin);
