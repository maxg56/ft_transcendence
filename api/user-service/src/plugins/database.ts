import fp from 'fastify-plugin';
import sequelize from '../config/database';
import User from '../models/User';
import Friendship from '../models/Friendship';

async function databasePlugin(fastify: any) {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    // await User.sync({ alter: true});
    // console.log("✅ User table synchronized")
    await Friendship.sync({ alter: true});
    console.log("✅ Friendship table synchronized")
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }

  fastify.decorate('db', sequelize);
}

export default fp(databasePlugin);
