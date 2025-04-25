import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User';
import { apiSuccess, apiError } from '../utils/apiResponse';

export async function enable2FA(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await User.findByPk(req.user.id); // JWT requis ici
    if (!user) return reply.code(404).send(apiError('User not found', 404, 'USER_NOT_FOUND'));

    const secret = speakeasy.generateSecret({
      name: `TonApp (${user.username})`,
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    if (secret.otpauth_url) {
        const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);
        return reply.send(apiSuccess({ qrCode: qrCodeDataURL, secret: secret.base32 }, 200));
    }
    return reply.status(500).send(apiError('Error generating QR code', 500, 'QR_CODE_GENERATION_ERROR'));
  } catch (err) {
    console.error(err);
    return reply.status(500).send(apiError('Internal server error', 500, 'INTERNAL_SERVER_ERROR'));
  }
}
