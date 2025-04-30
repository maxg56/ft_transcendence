import { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';
import Friendship from '../models/Friendship';
import User from '../models/User';
import { sendError, sendSuccess } from '../utils/reply';

async function seeFriendRequests (request: FastifyRequest, reply: FastifyReply) {
	try{
		const id = request.user.id
		console.log("🧩 user ID:", id)
		const friends= await Friendship.findAll({ where: { 
			user2: id,
			status: 'pending'
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
		
		// if (friends.length === 0)
		// 	return sendError(reply, 'No friend request pending', 404)
		const pendingList = friends.map(friendship => {
			const isUser1 = friendship.user1 === id;
			const otherUser = isUser1 ? friendship.userTwo : friendship.userOne;
			return {
				username: otherUser.username,
				avatar: otherUser.avatar
			};
		})
		return sendSuccess(reply, pendingList, 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'server error', 500)
	}
}

// async function seeFriends (request: FastifyRequest, reply: FastifyReply) {
// 	const id = request.user.id
// 		console.log("🧩 user ID:", id)
// 		const friends = await Friendship.findAll({ where: { 
// 				[Op.or]: [
// 					{ user1: id },
// 					{ user2: id }],
// 				status: 'accepted'
// 			},
// 			include: [{
// 				model: User,
// 				as: 'userOne',
// 				attributes: ['username', 'avatar'],
// 			},
// 			{	model: User,
// 				as: 'userTwo',
// 				attributes: ['username', 'avatar'],
// 			}]});
		
// 		// if (friends.length === 0)
// 		// 	return sendError(reply, 'No friend in the list', 404)

// 		const friendList = friends.map(friendship => {
// 			const isUser1 = friendship.user1 === id;
// 			const otherUser = isUser1 ? friendship.userTwo : friendship.userOne;
// 			return {
// 				username: otherUser.username,
// 				avatar: otherUser.avatar
// 			};
// 		})
// 		return friendList
// }

async function getFriendsList (request: FastifyRequest, reply: FastifyReply) {
	try {
		// const acceptedList = seeFriends(request, reply)
		// const pendingList = seeFriendRequests(request, reply)
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
		
		// if (friends.length === 0)
		// 	return sendError(reply, 'No friend in the list', 404)

		const friendList = friends.map(friendship => {
			const isUser1 = friendship.user1 === id;
			const otherUser = isUser1 ? friendship.userTwo : friendship.userOne;
			return {
				username: otherUser.username,
				avatar: otherUser.avatar
			};
		})

		const pending= await Friendship.findAll({ where: { 
			user1: id,
			status: 'pending'
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
		
		// if (pending.length === 0)
		// 	return sendError(reply, 'No friend request pending', 404)
		const pendingList = pending.map(friendship => {
			const isUser1 = friendship.user1 === id;
			const otherUser = isUser1 ? friendship.userTwo : friendship.userOne;
			return {
				username: otherUser.username,
				avatar: otherUser.avatar
			};
		})
		return sendSuccess(reply, {friendList, pendingList}, 200)
	} catch (error) {
		request.log.error(error);
		return sendError(reply, 'server error', 500)
	}
}

export {getFriendsList, seeFriendRequests}
