import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'
import { sendSuccess, sendError } from '../utils/reply';

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
try {
	const id = request.user.id
	console.log("🧩 Param ID:", id);
	const user = await User.findByPk(id, { attributes: ['username', 'avatar']});

	if (!user) {
		return sendError(reply, 'user not find', 404);
	}

	return sendSuccess(reply, user, 200);
	} catch (error) {
	request.log.error(error);
	return sendError(reply, 'servor error', 500);
}
};

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
try {
	const id = request.user.id
	console.log("🧩🧪 Param ID for PUT:", id);
	const { username, email, avatar } = request.body as { username?: string, email?: string, avatar?: string};
	const user = await User.findByPk(id, { attributes: ['username', 'email', 'avatar']});
	
	if (!user) {
		return sendError(reply, 'user not find', 404);
}

await User.update({ 
	username: username ?? user.username,
	email: email ?? user.email,
	avatar: avatar ?? user.avatar },
	{where: {id: id}});
	return sendSuccess(reply, 'modifications done', 200);
} catch (error) {
	request.log.error(error);
	return sendError(reply, 'servor error', 500);
}
};


// export default UserHandlers;