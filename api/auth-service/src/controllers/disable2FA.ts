import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User';
import { apiSuccess, apiError } from '../utils/apiResponse';

export async function disable2FA(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = await User.findByPk(req.user.id); // JWT requis ici
    if (!user) {
      return reply.code(404).send(apiError('User not found', 404, 'USER_NOT_FOUND'));
    }

    if (!user.is2FAEnabled) {
      return reply.code(400).send(apiError('2FA is not enabled for this user', 400, '2FA_NOT_ENABLED'));
    }

    user.twoFactorSecret = null;
    user.is2FAEnabled = false;
    await user.save();

    return reply.send(apiSuccess({ message: '2FA disabled successfully' }, 200));
  } catch (err) {
    console.error(err);
    return reply.status(500).send(apiError('Internal server error', 500, 'INTERNAL_SERVER_ERROR'));
  }
}
