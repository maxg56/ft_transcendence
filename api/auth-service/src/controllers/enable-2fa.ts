import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User';

export async function enable2FA(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await User.findByPk(req.user.id); // JWT requis ici
    if (!user) return reply.code(404).send({ error: 'User not found' });

    const secret = speakeasy.generateSecret({
      name: `TonApp (${user.username})`,
    });

    user.twoFactorSecret = secret.base32;
    await user.save();

    if (secret.otpauth_url) {
        const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);
        return reply.send({
            qrCode: qrCodeDataURL,
            manualEntryKey: secret.base32,
          });
    }
    return reply.status(500).send({ error: 'Error generating QR code' });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: 'Error enabling 2FA' });
  }
}
