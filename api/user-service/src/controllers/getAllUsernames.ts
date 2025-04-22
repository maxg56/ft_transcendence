import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'

export const getAllUsernames = async (request: FastifyRequest, reply:FastifyReply) => {
	try {
		const id = request.user.id
		const users = await User.findAll({attributes: ['username']});

		if (!users)
			return reply.code(404).send({ message: 'user not find'});
		return reply.send(users);

	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({message: 'server error'});
	}
}