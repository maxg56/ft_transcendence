import { FastifyRequest, FastifyReply } from 'fastify';
import User from '../models/User'

const UserHandlers = {
    async putUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            console.log("🧩🧪 Param ID for PUT:", id);
            const { username, avatar } = request.body as { username?: string, avatar?: string};
            const user = await User.findByPk(id);
            
            if (!user) {
        return reply.code(404).send({message: 'user not find'});
    }
    
    await User.update({ 
        username: username ?? user.username,
        avatar: avatar ?? user.avatar },
        {where: {id: id}});
        return reply.send({ message: 'user updated', user });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({message: 'server error'});
    }
    },
    async getUser(request: FastifyRequest, reply: FastifyReply) {
    try {
    const { id } = request.params as { id: string };
    console.log("🧩 Param ID:", id);
    const user = await User.findByPk(id, { attributes: ['id', 'username', 'avatar']});

    if (!user) {
        return reply.code(404).send({message: 'user not find'});
    }

    return reply.send(user);
    } catch (error) {
    request.log.error(error);
    return reply.code(500).send({message: 'server error'});
    }
    }
};

export default UserHandlers;