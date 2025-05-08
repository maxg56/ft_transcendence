import redis from '../../config/client';
import { BannedUser, MutedUser, ChatGroup } from '../../models/index';
import { sendToUser } from '../ws-utils';
import { WebSocket } from 'ws';



export async function handleInfractions(
  userId: string,
  count: number,
  ws: WebSocket,
  groupId: number
): Promise<void> {
  if (count === 0) return;

  const muteDurationMs = 60 * 1000; // 1 minute
  const banDurationMs = 5 * 60 * 1000; // 5 minutes

  // Vérification dans Redis pour voir si l'utilisateur est déjà banni ou mute
  const cachedBanStatus = await redis.get(`ban:${userId}`);
  const cachedMuteStatus = await redis.get(`mute:${userId}:${groupId}`);

  if (cachedBanStatus) {
    const banUntil = Number(cachedBanStatus);
    if (Date.now() < banUntil) {
      sendToUser(userId, { type: 'banned', duration: banDurationMs });
      ws.close();
      return;
    } else {
      redis.del(`ban:${userId}`);
    }
  }

  if (cachedMuteStatus) {
    const muteUntil = Number(cachedMuteStatus);
    if (Date.now() < muteUntil) {
      sendToUser(userId, { type: 'muted', duration: muteDurationMs });
      return;
    } else {
      // Si le mute est expiré, on peut le supprimer du cache
      redis.del(`mute:${userId}:${groupId}`);
    }
  }

  // Si l'utilisateur a 5 infractions ou plus, bannir
  if (count >= 5) {
    await BannedUser.upsert({
      user_id: userId,
      banned_until: new Date(Date.now() + banDurationMs),
    });

    // Mise à jour du cache Redis avec le nouveau statut
    redis.setex(`ban:${userId}`, banDurationMs / 1000, (Date.now() + banDurationMs).toString());

    sendToUser(userId, { type: 'banned', duration: banDurationMs });
    ws.close();
    return;
  }

  // Si l'utilisateur n'a pas assez d'infractions, il est mute
  const group = await ChatGroup.findByPk(groupId);
  if (!group) {
    console.error(`Group with id ${groupId} does not exist`);
    return; // ou throw une erreur personnalisée
  }

  await MutedUser.upsert({
    user_id: userId,
    group_id: group.id,
    muted_until: new Date(Date.now() + muteDurationMs),
  });

  // Mise à jour du cache Redis avec le nouveau statut de mute
  redis.setex(`mute:${userId}:${groupId}`, muteDurationMs / 1000, (Date.now() + muteDurationMs).toString());

  sendToUser(userId, { type: 'muted', duration: muteDurationMs });
}
