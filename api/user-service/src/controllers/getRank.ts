import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'

export const getRank = async (request: FastifyRequest, reply: FastifyReply) => {
try {
	const { id } = request.params as { id: string};
	const rank = await User.findByPk(id, {attributes: ['elo']});

	if (!rank)
		return reply.send(); //renvoyer valeur par default "elo": 1000

} catch (error) {
	request.log.error(error);
	return reply.code(500).send({message: 'server error'});
}
}