import { FastifyRequest, FastifyReply } from 'fastify';
import BannedUser from '../models/BannedUser';
import UserBlock from '../models/UserBlock';
import ChatGroup from '../models/ChatGroup';
import ChatGroupMember from '../models/ChatGroupMember';

// export async function getGroupMessages(request: FastifyRequest, reply: FastifyReply) {
//   const groupId = request.params['id'];
//   // Placeholder logic
//   return reply.send({ message: `Fetching messages for group ${groupId}` });
// }

export async function createGroup(request: FastifyRequest, reply: FastifyReply) {
  const userId = (request.user as any).id;
  const { name, members } = request.body as { name: string; members?: number[] };
  try {
    const group = await ChatGroup.create({ name, owner_id: userId });
    // add owner as member
    await ChatGroupMember.create({ group_id: group.id, user_id: userId });
    // add extra members
    if (Array.isArray(members)) {
      for (const mId of members) {
        await ChatGroupMember.create({ group_id: group.id, user_id: mId });
      }
    }
    reply.send({ success: true, group });
  } catch (error) {
    reply.status(500).send({ success: false, error });
  }
}

export async function banUser(request: FastifyRequest, reply: FastifyReply) {
  const { user_id, banned_until, reason } = request.body as {
    user_id: number;
    banned_until: string;
    reason?: string;
  };

  try {
    await BannedUser.upsert({ user_id, banned_until, reason });
    reply.send({ success: true, message: `User ${user_id} banned until ${banned_until}` });
  } catch (error) {
    reply.status(500).send({ success: false, error });
  }
}

export async function blockUser(request: FastifyRequest, reply: FastifyReply) {
  const { blocker_id, blocked_id } = request.body as {
    blocker_id: number;
    blocked_id: number;
  };

  try {
    await UserBlock.create({ blocker_id, blocked_id });
    reply.send({ success: true, message: `User ${blocked_id} blocked by ${blocker_id}` });
  } catch (error) {
    reply.status(500).send({ success: false, error });
  }
}

// Group REST controllers
export async function getUserGroups(request: FastifyRequest, reply: FastifyReply) {
  const userId = (request.user as any).id;
  const groups = await ChatGroup.findAll({
    include: [{ model: ChatGroupMember, where: { user_id: userId } }]
  });
  reply.send(groups);
}

export async function getGroup(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const groupId = Number(id);
  const group = await ChatGroup.findByPk(groupId, { include: [ChatGroupMember] });
  if (!group) return reply.status(404).send({ error: 'Group not found' });
  reply.send(group);
}

export async function updateGroup(request: FastifyRequest, reply: FastifyReply) {
  const userId = (request.user as any).id;
  const { id } = request.params as any;
  const groupId = Number(id);
  const { name } = request.body as { name: string };
  const group = await ChatGroup.findByPk(groupId);
  if (!group) return reply.status(404).send({ error: 'Group not found' });
  if (group.owner_id !== userId) return reply.status(403).send({ error: 'Forbidden' });
  group.name = name;
  await group.save();
  reply.send(group);
}

export async function deleteGroup(request: FastifyRequest, reply: FastifyReply) {
  const userId = (request.user as any).id;
  const { id } = request.params as any;
  const groupId = Number(id);
  const group = await ChatGroup.findByPk(groupId);
  if (!group) return reply.status(404).send({ error: 'Group not found' });
  if (group.owner_id !== userId) return reply.status(403).send({ error: 'Forbidden' });
  await group.destroy();
  reply.send({ success: true });
}

export async function addMember(request: FastifyRequest, reply: FastifyReply) {
  const userId = (request.user as any).id;
  const { id } = request.params as any;
  const groupId = Number(id);
  const { user_id } = request.body as { user_id: number };
  const group = await ChatGroup.findByPk(groupId);
  if (!group) return reply.status(404).send({ error: 'Group not found' });
  if (group.owner_id !== userId) return reply.status(403).send({ error: 'Forbidden' });
  await ChatGroupMember.create({ group_id: groupId, user_id });
  reply.send({ success: true });
}

export async function removeMember(request: FastifyRequest, reply: FastifyReply) {
  const userId = (request.user as any).id;
  const { id, memberId } = request.params as any;
  const groupId = Number(id);
  const memberIdNum = Number(memberId);
  const group = await ChatGroup.findByPk(groupId);
  if (!group) return reply.status(404).send({ error: 'Group not found' });
  if (group.owner_id !== userId) return reply.status(403).send({ error: 'Forbidden' });
  await ChatGroupMember.destroy({ where: { group_id: groupId, user_id: memberIdNum } });
  reply.send({ success: true });
}
