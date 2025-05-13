import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User';
import { apiSuccess, apiError } from '../utils/apiResponse';
import { hasId } from '../utils/hasId';

export async function check2FAStatus(req: FastifyRequest, reply: FastifyReply) {
	try {
		const value: string | object | Buffer = req.user;
		let id: string = '';
		if (hasId(value)) {
			id = value.id;
		}
		const user = await User.findByPk(id);

		if (!user) return reply.code(404).send(apiError('User not found', 404, 'USER_NOT_FOUND'));
	
		return reply.send(apiSuccess(user.is2FAEnabled, 200));
	} catch (err) {
	  console.error(err);
	  return reply.status(500).send(apiError('Internal server error', 500, 'INTERNAL_SERVER_ERROR'));
	}
  }
  