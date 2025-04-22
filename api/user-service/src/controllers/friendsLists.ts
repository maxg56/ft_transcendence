import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';
import User from '../models/User';
import { sendError, sendSuccess } from '../utils/reply';

async function seeFriendRequests (request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.id
		console.log("🧩 user ID:", id)
		const friendList = await Friendship.findAll({ where: { 
				[Op.or]: [
					{ user1: id },
					{ user2: id }],
				status: 'pending'
			}});
		
		if (friendList.length === 0)
			return sendError(reply, 'No friend request pending', 404)
		return sendSuccess(reply, friendList, 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'server error', 500)
	}
}

async function seeFriends (request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.id
		console.log("🧩 user ID:", id)
		const friends = await Friendship.findAll({ where: { 
				[Op.or]: [
					{ user1: id },
					{ user2: id }],
				status: 'accepted'
			},
			include: [{
				model: User,
				as: 'userOne',
				attributes: ['username', 'avatar'],
			},
			{	model: User,
				as: 'userTwo',
				attributes: ['username', 'avatar'],
			}]});
		
		if (friends.length === 0)
			return sendError(reply, 'No friend in the list', 404)

		const friendList = friends.map(friendship => {
			const isUser1 = friendship.user1 === id;
			const otherUser = isUser1 ? friendship.userTwo : friendship.userOne;
			return {
				// friendshipId: friendship.id, 
				// userId: otherUser.id,
				username: otherUser.username,
				avatar: otherUser.avatar
			};
		})
		
		return sendSuccess(reply, friendList, 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'server error', 500)
	}
}

export {seeFriendRequests, seeFriends}
