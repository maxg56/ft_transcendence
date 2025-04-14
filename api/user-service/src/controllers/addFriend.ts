import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';

export const addFriend = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const {user1, user2} = request.body as {user1: number, user2: number}
		const isFriend = await Friendship.findOne({
			where: {
				[Op.or]: [
				{ user1, user2 },
				{ user2, user1 }],
			}
		})

		if (isFriend)
			return reply.code(409).send({ message: 'Request already send'});
		const friendship = await Friendship.create({ user1, user2, status: 'pending'})
		return reply.send({message: "Friend request send"});
	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({message: 'server error'});
	}
}