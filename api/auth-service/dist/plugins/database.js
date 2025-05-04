"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const database_1 = __importDefault(require("../config/database"));
async function databasePlugin(fastify) {
    const maxRetries = 5;
    const retryDelay = 5000; // 2 seconds
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await database_1.default.authenticate();
            console.log('✅ Database connected successfully');
            // await sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
            // await sequelize.sync({ alter: true })
            // await sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
            // console.log('sync force/alter all tables')
            break;
        }
        catch (error) {
            console.error(`❌ Unable to connect to the database (Attempt ${attempt}/${maxRetries}):`);
            if (attempt === maxRetries) {
                console.error(error);
            }
            console.log(`Retrying in ${retryDelay / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
    }
    fastify.decorate('db', database_1.default);
}
exports.default = (0, fastify_plugin_1.default)(databasePlugin);
