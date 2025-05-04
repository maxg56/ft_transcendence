"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login_controller = login_controller;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
async function login_controller(username, password, reply) {
    try {
        const user = await User_1.default.findOne({ where: { username } });
        if (!user) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }
        // Vérifie si 2FA est activée
        if (user.is2FAEnabled) {
            const tempToken = await reply.jwtSign({ id: user.id, username: user.username, twoFactorPending: true }, { expiresIn: '2m' });
            return reply.send({ twoFactorRequired: true, tempToken });
        }
        await User_1.default.update({ lastLogin_at: new Date() }, { where: { id: user.id } });
        const payload = { id: user.id, username: user.username };
        const accessToken = await reply.jwtSign(payload, { expiresIn: '15m' });
        const refreshToken = await reply.jwtSign(payload, { expiresIn: '7d' });
        return reply.send({ token: accessToken, refreshToken });
    }
    catch (error) {
        reply.code(500).send({ error: 'Internal server error' });
    }
}
exports.default = {
    async login(req, reply) {
        const { username, password } = req.body;
        return await login_controller(username, password, reply);
    },
    async register(req, reply) {
        const { username, email, password } = req.body;
        try {
            const existingUser = await User_1.default.findOne({ where: { username } });
            if (existingUser) {
                return reply.status(400).send({ error: 'Username already taken' });
            }
            const existingEmail = await User_1.default.findOne({ where: { email } });
            if (existingEmail) {
                return reply.status(400).send({ error: 'Email already in use' });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = await User_1.default.create({ username, email, password: hashedPassword });
            console.log('📌 New user registered:', user.username);
            return await login_controller(username, password, reply);
        }
        catch (err) {
            console.error(err);
            return reply.status(500).send({ error: `Error during registration $(err)` });
        }
    },
    async refresh(req, reply) {
        try {
            let token;
            if (req.user && typeof req.user === 'object' && 'username' in req.user && 'id' in req.user) {
                token = await reply.jwtSign({ username: req.user.username, id: req.user.id });
            }
            else {
                throw new Error('User is not authenticated');
            }
            return reply.send({ token });
        }
        catch (err) {
            console.error('Error refreshing token:', err);
            return reply.status(401).send({ error: 'Invalid or expired refresh token' });
        }
    }
};
