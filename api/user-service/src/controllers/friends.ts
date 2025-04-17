import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';
import User from '../models/User';

async function addFriend (request: FastifyRequest<{ Body: {username: string}}>, reply: FastifyReply) {
	try {
		const id = request.user.id
		// console.log("id user login: ", id)
		const { username } = request.body
		// console.log("user2 name:", username)
		const userId = await User.findOne({ where: { username: username}, attributes: ["id"]})
		if (!userId)
			return reply.code(404).send({ message: "user not find"})
		// console.log("user2Id:", userId.id)
		const isFriend = await Friendship.findOne({
			where: {
				[Op.or]: [
				{ user1: id, user2: userId.id },
				{ user1: userId.id, user2: id }],
			}
		})
		// console.log("isFriend:", isFriend)

		if (isFriend)
			return reply.code(409).send({ message: 'Request already send'});
		const friendship = await Friendship.create({ 
				user1: id,
				user2: userId.id,
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