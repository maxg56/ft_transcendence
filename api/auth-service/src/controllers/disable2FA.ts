import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User';
import { apiSuccess, apiError } from '../utils/apiResponse';
import {hasId} from '../utils/hasId';

export async function disable2FA(req: FastifyRequest, reply: FastifyReply) {
  try {
    if (!req.user) {
      return reply.code(401).send(apiError('Unauthorized', 401, 'UNAUTHORIZED'));
    }
   
    const value: string | object | Buffer = req.user;
    let id: string = '';
    if (hasId(value)) {
      id = value.id;
    }
    const user = await User.findByPk(id); // JWT requis ici
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
