import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'
import { sendSuccess, sendError } from '../utils/reply';

export const getElo = async (request: FastifyRequest, reply: FastifyReply) => {
try {
	const id = request.user.id
	const elo = await User.findByPk(id, {attributes: ['elo']});

	if (!elo)
		return reply.code(404).send({ message: 'elo not find' });

	return sendSuccess(reply, elo, 200);

} catch (error) {
	request.log.error(error);
	return sendError(reply, 'server error', 500);
}
}