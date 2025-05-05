import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'
import { sendSuccess, sendError } from '../utils/reply';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';
import { hasId } from '../utils/hasId';

export const getAllUsernames = async (request: FastifyRequest, reply:FastifyReply) => {
	try {
		const value: string | object | Buffer = request.user
		let id: number | null = null;
		if (hasId(value)) {
		  const rawId = value.id;
		  id = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;
		}
		if (typeof id !== 'number' || isNaN(id)) {
		  return sendError(reply, 'Invalid user ID', 400);
		}
		const friendships = await Friendship.findAll({
			where: {
				[Op.and]: [{
					[Op.or]: [
						{ status: 'accepted' },
						{ status: 'pending' }
					]},
					{[Op.or]: [
						{ user1: id },
						{ user2: id }
					]}
				]
			},
			attributes: ['user1', 'user2']
		})

		const friendIds = new Set<number>()
		for (const f of friendships) {
			if (f.user1 !== id) friendIds.add(f.user1)
			if (f.user2 !== id) friendIds.add(f.user2)
		}

		const users = await User.findAll({
			where: {
				id: {
					[Op.notIn]: [id, ...friendIds]
				},
				username: {
					[Op.notLike]: 'deleted%',
				}
			},
			attributes: ['username']
		})

		if (!users)
			return reply.code(404).send({ message: 'user not find'});
		return sendSuccess(reply, users, 200);

	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'server error', 500);
	}
}