import fp from 'fastify-plugin';
import { 
  createGroup,
  getUserGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  banUser,
  blockUser 
} from '../controllers/GroupController';
// import friendsRoutes from './friends';
// import { getPrivateChannel } from '../utils/channel';
// import Friendship from '../models/Friendship';
// import User from '../models/User';

async function chatRoutes(fastify: any) {
  fastify.post("/chat/banned", { preHandler: [fastify.authenticate] }, banUser);
  fastify.post("/chat/block", { preHandler: [fastify.authenticate] }, blockUser);
  // Group endpoints
  fastify.post("/chat/groups", { preHandler: [fastify.authenticate] }, createGroup);
  fastify.get("/chat/groups", { preHandler: [fastify.authenticate] }, getUserGroups);
  fastify.get("/chat/groups/:id", { preHandler: [fastify.authenticate] }, getGroup);
  fastify.put("/chat/groups/:id", { preHandler: [fastify.authenticate] }, updateGroup);
  fastify.delete("/chat/groups/:id", { preHandler: [fastify.authenticate] }, deleteGroup);
  // Group member management
  fastify.post("/chat/groups/:id/members", { preHandler: [fastify.authenticate] }, addMember);
  fastify.delete("/chat/groups/:id/members/:memberId", { preHandler: [fastify.authenticate] }, removeMember);
  // Private chat initiation
  // fastify.post(
  //   "/chat/private/initiate",
  //   { preHandler: [fastify.authenticate] },
  //   async (req, reply) => {
  //     const meId = req.user.id;
  //     const meUsername = req.user.username;
  //     const friendId = req.body.friendId;
  //     // Vérifier amitié
  //     const exist = await Friendship.findOne({ where: { user1: meId, user2: friendId, status: 'accepted' } });
  //     if (!exist) return reply.code(403).send({ error: 'Not your friend' });
  //     const friendUser = await User.findByPk(friendId);
  //     if (!friendUser) return reply.code(404).send({ error: 'User not found' });
  //     const channel = getPrivateChannel(meUsername, friendUser.username);
  //     return { channel };
  //   }
  // );
  // fastify.register(friendsRoutes);
}

export default fp(chatRoutes);
