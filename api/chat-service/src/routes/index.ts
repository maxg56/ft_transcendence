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
}

export default fp(chatRoutes);
