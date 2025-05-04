"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disable2FA = disable2FA;
const User_1 = __importDefault(require("../models/User"));
const apiResponse_1 = require("../utils/apiResponse");
const hasId_1 = require("../utils/hasId");
async function disable2FA(req, reply) {
    try {
        if (!req.user) {
            return reply.code(401).send((0, apiResponse_1.apiError)('Unauthorized', 401, 'UNAUTHORIZED'));
        }
        const value = req.user;
        let id = '';
        if ((0, hasId_1.hasId)(value)) {
            id = value.id;
        }
        const user = await User_1.default.findByPk(id); // JWT requis ici
        if (!user) {
            return reply.code(404).send((0, apiResponse_1.apiError)('User not found', 404, 'USER_NOT_FOUND'));
        }
        if (!user.is2FAEnabled) {
            return reply.code(400).send((0, apiResponse_1.apiError)('2FA is not enabled for this user', 400, '2FA_NOT_ENABLED'));
        }
        user.twoFactorSecret = null;
        user.is2FAEnabled = false;
        await user.save();
        return reply.send((0, apiResponse_1.apiSuccess)({ message: '2FA disabled successfully' }, 200));
    }
    catch (err) {
        console.error(err);
        return reply.status(500).send((0, apiResponse_1.apiError)('Internal server error', 500, 'INTERNAL_SERVER_ERROR'));
    }
}
