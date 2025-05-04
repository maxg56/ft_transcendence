"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enable2FA = enable2FA;
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const User_1 = __importDefault(require("../models/User"));
const apiResponse_1 = require("../utils/apiResponse");
const hasId_1 = require("../utils/hasId");
async function enable2FA(req, reply) {
    try {
        const value = req.user;
        let id = '';
        if ((0, hasId_1.hasId)(value)) {
            id = value.id;
        }
        const user = await User_1.default.findByPk(id); // JWT requis ici
        if (!user)
            return reply.code(404).send((0, apiResponse_1.apiError)('User not found', 404, 'USER_NOT_FOUND'));
        const secret = speakeasy_1.default.generateSecret({
            name: `TonApp (${user.username})`,
        });
        user.twoFactorSecret = secret.base32;
        await user.save();
        if (secret.otpauth_url) {
            const qrCodeDataURL = await qrcode_1.default.toDataURL(secret.otpauth_url);
            return reply.send((0, apiResponse_1.apiSuccess)({ qrCode: qrCodeDataURL, secret: secret.base32 }, 200));
        }
        return reply.status(500).send((0, apiResponse_1.apiError)('Error generating QR code', 500, 'QR_CODE_GENERATION_ERROR'));
    }
    catch (err) {
        console.error(err);
        return reply.status(500).send((0, apiResponse_1.apiError)('Internal server error', 500, 'INTERNAL_SERVER_ERROR'));
    }
}
