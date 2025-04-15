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
};

export const seeFriendRequests = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const { id } = request.params as { id: string };
		console.log("🧩🧩🧩 user ID:", id)
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


// export const acceptFriend = async (request: FastifyRequest, reply: FastifyReply) => {
// 	try {
// 		const {user1, user2} = request.body as {user1: number, user2: number}
// 		const friendship = await Friendship.findOne({
// 			where: {
// 				[Op.or]: [
// 				{ user1: user1, user2: user2 },
// 				{ user1: user2, user2: user1}],
// 				status: 'pending'
// 			}
// 		})

// 		if (!friendship)
// 			return reply.code(404).send({ message: 'Request not find' });
// 		if (friendship.user2 !== user2)
// 			return reply.code(403).send({ message: "Unauthorized: the sender can't accept the request"});

// 		await friendship.update({ status: 'accepted' });
// 		const otherSideFriendship = await Friendship.create({ user2, user1, status: "accepted"});
// 		return reply.send({ message: 'Friend request accepted', friendship, otherSideFriendship });
// 	} catch (error) {
// 		request.log.error(error);
// 		return reply.code(500).send({ message: 'server error' });
// 	}
// };