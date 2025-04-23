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
async function databasePlugin(fastify: any) {
	try {
		await sequelize.authenticate();
		console.log('✅ Database connected successfully');
		// addColumnIfNotExists('user', 'lastLogin_at', {
		// 	type: DataTypes.DATE,
		// 	allowNull: false,
		// 	defaultValue: DataTypes.NOW,
		// })
		// await User.sync({ alter: true })
		// console.log("✅ User table synchronized")
		
	} catch (error) {
		console.error('❌ Unable to connect to the database:', error);
		throw error;
	}

	fastify.decorate('db', sequelize);
}

export default fp(databasePlugin);
