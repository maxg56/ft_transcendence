// src/ws/getGroupMembers.ts
import ChatGroupMember from '../models/ChatGroupMember';

/**
 * Retourne la liste des userId (string) membres du groupe.
 */
export async function getGroupMembers(groupId: number | string): Promise<string[]> {
  const members = await ChatGroupMember.findAll({
    where: { group_id: groupId },
    attributes: ['user_id'],
  });
  return members.map(m => String(m.user_id));
}
