import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'

// const UserHandlers = {

export const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
try {
	const id = request.user.id
	console.log("🧩 Param ID:", id);
	const user = await User.findByPk(id, { attributes: ['username', 'avatar']});

	if (!user) {
		return reply.code(404).send({message: 'user not find'});
}

return reply.send(user);
} catch (error) {
	request.log.error(error);
	return reply.code(500).send({message: 'server error'});
}
};

export const updateUser = async (request: FastifyRequest, reply: FastifyReply) => {
try {
	const id = request.user.id
	console.log("🧩🧪 Param ID for PUT:", id);
	const { username, avatar } = request.body as { username?: string, avatar?: string};
	const user = await User.findByPk(id, { attributes: ['id', 'username', 'avatar']});
	
	if (!user) {
		return reply.code(404).send({message: 'user not find'});
}

await User.update({ 
	username: username ?? user.username,
	avatar: avatar ?? user.avatar },
	{where: {id: id}});
	return reply.send({ message: 'user changes done'});
} catch (error) {
	request.log.error(error);
	return reply.code(500).send({message: 'server error'});
}
};


// export default UserHandlers;