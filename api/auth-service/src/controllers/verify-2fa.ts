import speakeasy from 'speakeasy';
import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User';

export async function verify2FA(req: FastifyRequest<{ Body: { code: string } }>, reply: FastifyReply) {
  const { code } = req.body;
  try {
    const user = await User.findByPk(req.user.id); // JWT requis ici
    if (!user) return reply.code(404).send({ error: 'User not found' });

    // Vérification du code TOTP
    if (!user.twoFactorSecret) {
      return reply.code(400).send({ error: '2FA is not enabled for this user' });
    }
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
    });

    if (!verified) {
      return reply.code(400).send({ error: 'Invalid 2FA code' });
    }

    user.is2FAEnabled = true;
    await user.save();

    const token = await reply.jwtSign({ id: user.id, username: user.username });

    return reply.send({ token });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: 'Error verifying 2FA' });
  }
}
