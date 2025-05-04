"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const index_1 = __importDefault(require("./routes/index"));
const database_1 = __importDefault(require("./plugins/database"));
const auth_1 = __importDefault(require("./plugins/auth"));
const User_1 = __importDefault(require("./models/User"));
const fastify = (0, fastify_1.default)({ logger: true });
const PORT = process.env.PORT_AUTH || 3000;
// Plugins
// fastify.register(fastifyFormBody); // Pour les requêtes x-www-form-urlencoded
fastify.register(database_1.default);
fastify.register(auth_1.default);
// Routes
fastify.register(index_1.default);
fastify.ready().then(() => {
    console.log("📌 Fastify is ready, initializing models...");
    console.log("✅ User model loaded:", !!User_1.default);
});
const start = async () => {
    try {
        await fastify.listen({ port: Number(PORT), host: '0.0.0.0' });
        console.log(`Auth Service lancé sur http://localhost:${PORT}`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
