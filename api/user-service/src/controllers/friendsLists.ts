import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';
import User from '../models/User';

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
			return reply.send({ message: "No friend request pending"})
		return reply.send(friendList)
	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({message: 'server error'});
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
				as: "userOne",
				attributes: ["id", "username", "avatar"],
			},
			{	model: User,
				as: "userTwo",
				attributes: ["id", "username", "avatar"],
			}]});
		
		if (friends.length === 0)
			return reply.send({ message: "No friend in the list"})

		const friendList = friends.map(friendship => {
			const isUser1 = friendship.user1 === id;
			const otherUser = isUser1 ? friendship.userTwo : friendship.userOne;
			return {
				friendshipId: friendship.id, 
				userId: otherUser.id,
				username: otherUser.username,
				avatar: otherUser.avatar
			};
		})
		
		return reply.send(friendList)
	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({message: 'server error'});
	}
}

export {seeFriendRequests, seeFriends}
