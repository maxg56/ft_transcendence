import speakeasy from 'speakeasy';
import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User';
import { apiSuccess , apiError} from '../utils/apiResponse';

export async function verify2FA(req: FastifyRequest<{ Body: { code: string } }>, reply: FastifyReply) {
  const { code } = req.body;
  try {
    const user = await User.findByPk(req.user.id); // JWT requis ici
    if (!user) return reply.code(404).send(apiError('User not found', 404, 'USER_NOT_FOUND'));

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
      return reply.code(400).send(apiError('Invalid 2FA code', 400, 'INVALID_2FA_CODE'));
    }

    user.is2FAEnabled = true;
    await user.save();

    const payload = { id: user.id, username: user.username };
    const accessToken = await reply.jwtSign(payload, { expiresIn: '15m' });
    const refreshToken = await reply.jwtSign(payload, { expiresIn: '7d' });

    return reply.send(apiSuccess( {token: accessToken, refreshToken }, 200));
  } catch (err) {
    console.error(err);
    return reply.status(500).send(apiError('Internal server error', 500, 'INTERNAL_SERVER_ERROR'));
  }
}
