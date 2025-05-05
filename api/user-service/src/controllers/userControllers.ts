import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'
import { sendSuccess, sendError } from '../utils/reply';
import { hasId } from '../utils/hasId';

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
try {
	const value: string | object | Buffer = request.user;
	let id: number | null = null;
	if (hasId(value)) {
	  const rawId = value.id;
	  id = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;
	}
	if (typeof id !== 'number' || isNaN(id)) {
	  return sendError(reply, 'Invalid user ID', 400);
	}
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
	const value: string | object | Buffer = request.user;
	let id: number | null = null;
	if (hasId(value)) {
	  const rawId = value.id;
	  id = typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;
	}
	if (typeof id !== 'number' || isNaN(id)) {
	  return sendError(reply, 'Invalid user ID', 400);
	}
	console.log("🧩🧪 Param ID for PUT:", id);
	const { username } = request.body as { username?: string};
	const user = await User.findByPk(id, { attributes: ['username']});
	
	if (!user) {
		return sendError(reply, 'user not find', 404);
}

await User.update({ 
	username: username ?? user.username},
	{where: {id: id}});
	return sendSuccess(reply, 'modifications done', 200);
} catch (error) {
	request.log.error(error);
	return sendError(reply, 'servor error', 500);
}
};


// export default UserHandlers;