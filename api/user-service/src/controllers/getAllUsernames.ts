import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'
import { sendSuccess, sendError } from '../utils/reply';
import { Op } from 'sequelize';

export const getAllUsernames = async (request: FastifyRequest, reply:FastifyReply) => {
	try {
		const id = request.user.id
		const users = await User.findAll({
			where: {
				[Op.not]: [
					{ username: {
					[Op.substring]: 'deleted'
					}}
				]},
			attributes: ['username']});

		if (!users)
			return reply.code(404).send({ message: 'user not find'});
		return sendSuccess(reply, users, 200);

	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'server error', 500);
	}
}