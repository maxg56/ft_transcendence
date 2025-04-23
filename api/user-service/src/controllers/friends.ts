import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';
import User from '../models/User';
import { sendError, sendSuccess } from '../utils/reply';

async function addFriend (request: FastifyRequest<{ Body: {username: string}}>, reply: FastifyReply) {
	try {
		const id = request.user.id
		// console.log("id user login: ", id)
		const { username } = request.body
		// console.log("user2 name:", username)
		const userId = await User.findOne({ where: { username: username}, attributes: ["id"]})
		if (!userId)
			return sendError(reply, 'user not find', 404)
		const isFriend = await Friendship.findOne({
			where: {
				[Op.or]: [
				{ user1: id, user2: userId.id },
				{ user1: userId.id, user2: id }],
			}
		})
		// console.log("isFriend:", isFriend)

		if (isFriend)
			return sendError(reply, 'Request already send', 409)
		const friendship = await Friendship.create({ 
				user1: id,
				user2: userId.id,
				status: 'pending'})
		return sendSuccess(reply, 'Friend request send', 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500)
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
			return sendError(reply, 'user not find', 404)
		const friendship = await Friendship.findOne({
			where: {
				user1: userId.id,
				user2: id,
				status: 'pending'
			}
		})

		if (!friendship)
			return sendError(reply, 'Friend request not find', 404)
		await friendship.update({ status: 'accepted' });
		return sendSuccess(reply, 'Friend request accepted', 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500)
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
			return sendError(reply, 'user not find', 404)
		const friendship = await Friendship.findOne({
			where: {
				user1: userId.id,
				user2: id,
				status: 'pending'
			}
		})

		if (!friendship)
			return sendError(reply, 'Friend request not find', 404)
		await friendship.destroy();
		return sendSuccess(reply, 'Friend request refused', 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'servor error', 500)
	}
};

export {acceptFriend, refuseFriend, addFriend}