import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'
import { sendSuccess, sendError } from '../utils/reply';
import { hasId } from '../utils/hasId';

export const getElo = async (request: FastifyRequest, reply: FastifyReply) => {
try {
	const value: string | object | Buffer = request.user;
	let id: number | null = null;
	if (hasId(value)) {
	  const rawId = value.id;
	  id = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;
	}
	if (typeof id !== 'number' || isNaN(id)) {
	  return sendError(reply, 'Invalid user ID', 400);
	}
	const elo = await User.findByPk(id, {attributes: ['elo']});

	if (!elo)
		return reply.code(404).send({ message: 'elo not find' });

	return sendSuccess(reply, elo, 200);

} catch (error) {
	request.log.error(error);
	return sendError(reply, 'server error', 500);
}
}