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

async function acceptFriend (request: FastifyRequest<{ Body: {username: string}}>, reply: FastifyReply)  {
	try {
		const id = request.user.id
		// console.log("user id", id)
		const { username } = request.body
		// console.log("🧩 sender request username:", username)
		const userId = await User.findOne({ where: { username: username}, attributes: ["id"]})
		if (!userId)
			return reply.code(404).send({ message: "user not find"})
		const friendship = await Friendship.findOne({
			where: {
				user1: userId.id,
				user2: id,
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

async function refuseFriend (request: FastifyRequest<{ Body: {username: string}}>, reply: FastifyReply)  {
	try {
		const id = request.user.id
		// console.log("user id", id)
		const { username } = request.body
		// console.log("sender request:", username)
		const userId = await User.findOne({ where: { username: username}, attributes: ["id"]})
		if (!userId)
			return reply.code(404).send({ message: "user not find"})
		const friendship = await Friendship.findOne({
			where: {
				user1: userId.id,
				user2: id,
				status: 'pending'
			}
		})

		if (!friendship)
			return reply.code(404).send({ message: 'Friend request not find' });
		await friendship.destroy();
		return reply.send({ message: 'Friend request refused' });
	} catch (error) {
		request.log.error(error);
		return reply.code(500).send({ message: 'server error' });
	}
};

export {acceptFriend, refuseFriend, addFriend}