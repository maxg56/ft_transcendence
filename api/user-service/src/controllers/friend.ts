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

async function seeFriendRequests (request: FastifyRequest, reply: FastifyReply) {
	try {
		const id = request.user.id
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
};


async function acceptFriend (request: FastifyRequest<{ Body: {user1: number}}>, reply: FastifyReply)  {
	try {
		const userid = request.user.id
		console.log("user id", userid)
		const { user1 } = request.body
		console.log("🧩🧩🧩🧩🧩🧩 sender request ID:", user1)
		const friendship = await Friendship.findOne({
			where: {
				user1: user1,
				user2: userid,
				status: 'pending'
			}
		})

		if (!friendship)
			return reply.code(404).send({ message: 'Friend request not find' });
		await friendship.update({ status: 'accepted' });
		return reply.send({ message: 'Friend request accepted', friendship });
	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({ message: 'server error' });
	}
};

export {seeFriendRequests, acceptFriend}