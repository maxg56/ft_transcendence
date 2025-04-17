import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';

async function addFriend (request: FastifyRequest<{ Body: {user: number}}>, reply: FastifyReply) {
	try {
		const id = request.user.id
		console.log("id: ", id)
		const { user } = request.body
		console.log("user2 id:", user)
		const isFriend = await Friendship.findOne({
			where: {
				[Op.or]: [
				{ user1: id, user2: user },
				{ user1: user, user2: id }],
			}
		})

		if (isFriend)
			return reply.code(409).send({ message: 'Request already send'});
		console.log("isFriend:", isFriend)
		const friendship = await Friendship.create({ 
				user1: id,
				user2: user,
				status: 'pending'})
		return reply.send({message: "Friend request send"});
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
		console.log("🧩 sender request ID:", user1)
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

async function refuseFriend (request: FastifyRequest<{ Body: {user1: number}}>, reply: FastifyReply)  {
	try {
		const userid = request.user.id
		console.log("user id", userid)
		const { user1 } = request.body
		console.log("sender request ID:", user1)
		const friendship = await Friendship.findOne({
			where: {
				user1: user1,
				user2: userid,
				status: 'pending'
			}
		})

		if (!friendship)
			return reply.code(404).send({ message: 'Friend request not find' });
		await friendship.update({ status: 'blocked' });
		return reply.send({ message: 'Friend request blocked', friendship });
	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({ message: 'server error' });
	}
};

export {acceptFriend, refuseFriend, addFriend}