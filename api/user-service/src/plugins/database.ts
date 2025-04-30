import fp from 'fastify-plugin';
import sequelize from '../config/database';
import User from '../models/User';
import Friendship from '../models/Friendship';
import { DataTypes, Model } from 'sequelize';

/**
 * 
 * @param tableName le nom de la table a laquelle on veut ajouter une colonne
 * @param newColumn le nom de la nouvelle colonne
 * @param data les caracteristiques de la nouvelle colonne
 * exemple : addColumnIfNotExists('user', 'lastLogin_at', {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		})
 */
async function addColumnIfNotExists(tableName: string, newColumn: string, data: any) {
	const queryInterface = sequelize.getQueryInterface()
	const exist = await queryInterface.describeTable(tableName)
	if (!exist[newColumn]) {
		await queryInterface.addColumn(tableName, newColumn, data)
		console.log(`✅ Colonne ${newColumn} ajoutée à la table ${tableName}.`)
	} else {
		console.log(`ℹ️ La colonne ${newColumn} existe déjà.`);
	}
}

// await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
// await sequelize.sync({ force: true })
// await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
// console.log('sync force all tables')
// desactive les contraintes de cles etrangeres entre table, drop les tables,
// create les tables et reactive les contraintes de cles etrangeres
// addColumnIfNotExists('user', 'lastLogin_at', {
		

async function databasePlugin(fastify: any) {
	const maxRetries = 5;
	const retryDelay = 5000; // 2 seconds
  
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
	  try {
		await sequelize.authenticate();
		console.log('✅ Database connected successfully');
		// 	type: DataTypes.DATE,
		// 	allowNull: false,
		// 	defaultValue: DataTypes.NOW,
		// })
		// await User.sync({ alter: true })
		// console.log("✅ User table synchronized")
			
		// await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
		// await sequelize.sync({ alter: true })
		// await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
		// console.log('sync force/alter all tables')
		break;
	  } catch (error) {
		console.error(`❌ Unable to connect to the database (Attempt ${attempt}/${maxRetries}):`, error);
		if (attempt === maxRetries) {
		  throw error;
		}
		console.log(`Retrying in ${retryDelay / 1000} seconds...`);
		await new Promise((resolve) => setTimeout(resolve, retryDelay));
	  }
	}
  
	fastify.decorate('db', sequelize);
  }

export default fp(databasePlugin);
