"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify2FA = verify2FA;
const speakeasy_1 = __importDefault(require("speakeasy"));
const User_1 = __importDefault(require("../models/User"));
const apiResponse_1 = require("../utils/apiResponse");
const hasId_1 = require("../utils/hasId");
async function verify2FA(req, reply) {
    const { code } = req.body;
    try {
        const value = req.user;
        let id = '';
        if ((0, hasId_1.hasId)(value)) {
            id = value.id;
        }
        // Now, TypeScript knows req.user is correctly typed
        const user = await User_1.default.findByPk(id);
        if (!user)
            return reply.code(404).send((0, apiResponse_1.apiError)('User not found', 404, 'USER_NOT_FOUND'));
        // Verify 2FA code
        if (!user.twoFactorSecret) {
            return reply.code(400).send({ error: '2FA is not enabled for this user' });
        }
        const verified = speakeasy_1.default.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: code,
        });
        if (!verified) {
            return reply.code(400).send((0, apiResponse_1.apiError)('Invalid 2FA code', 400, 'INVALID_2FA_CODE'));
        }
        user.is2FAEnabled = true;
        await user.save();
        const payload = { id: user.id, username: user.username };
        const accessToken = await reply.jwtSign(payload, { expiresIn: '15m' });
        const refreshToken = await reply.jwtSign(payload, { expiresIn: '7d' });
        return reply.send((0, apiResponse_1.apiSuccess)({ token: accessToken, refreshToken }, 200));
    }
    catch (err) {
        console.error(err);
        return reply.status(500).send((0, apiResponse_1.apiError)('Internal server error', 500, 'INTERNAL_SERVER_ERROR'));
    }
}
