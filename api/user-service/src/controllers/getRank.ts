import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'

export const getRank = async (request: FastifyRequest, reply: FastifyReply) => {
try {
	const { id } = request.params as { id: string};
	const rank = await User.findByPk(id, {attributes: ['elo']});

	if (!rank)
		return reply.code(404).send({ message: 'rank not find' });

	return reply.send(rank);

} catch (error) {
	request.log.error(error);
	return reply.code(500).send({message: 'server error'});
}
}