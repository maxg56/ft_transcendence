"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const apiResponse_1 = require("../utils/apiResponse");
exports.default = (0, fastify_plugin_1.default)(async function (fastify) {
    fastify.register(jwt_1.default, {
        secret: process.env.JWT_SECRET || 'supersecretkey',
        sign: {
            expiresIn: '1h',
        },
    });
    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.code(401).send((0, apiResponse_1.apiError)('Token is invalid or expired', 401));
        }
    });
});
