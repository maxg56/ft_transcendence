"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const enable_2fa_1 = require("../controllers/enable-2fa");
const verify_2fa_1 = require("../controllers/verify-2fa");
const disable2FA_1 = require("../controllers/disable2FA");
async function authRoutes(fastify) {
    fastify.post('/auth/login', auth_controller_1.default.login);
    fastify.post('/auth/register', auth_controller_1.default.register);
    fastify.post('/auth/refresh', { preHandler: [fastify.authenticate] }, auth_controller_1.default.refresh);
    fastify.post('/auth/enable-2fa', { preHandler: [fastify.authenticate] }, enable_2fa_1.enable2FA);
    fastify.post('/auth/verify-2fa', { preHandler: [fastify.authenticate] }, verify_2fa_1.verify2FA);
    fastify.post('/auth/disable2FA', { preHandler: [fastify.authenticate] }, disable2FA_1.disable2FA);
}
exports.default = (0, fastify_plugin_1.default)(authRoutes);
