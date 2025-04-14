import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import User from '../models/User'
import Friendship from '../models/Friendship';

export const addFriend = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const {user1, user2} = request.body as {user:  }
		const isFriend = await Friendship.findOne({
			where: {
				[Op.or]: [
				{ user1: player.id, user2: host.id },
				{ user1: host.id, user2: player.id },
				],
			},
		  })
		
	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({message: 'server error'});
	}
}