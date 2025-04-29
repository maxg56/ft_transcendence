import fp from 'fastify-plugin';
import sequelize from '../config/database';

async function databasePlugin(fastify: any) {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
		// await sequelize.sync({ alter: true })
		// await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
		// console.log('✅ sync force/alter all tables')
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }

  fastify.decorate('db', sequelize);
}

export default fp(databasePlugin);
