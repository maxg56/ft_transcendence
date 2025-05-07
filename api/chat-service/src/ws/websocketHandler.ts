import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { addMessageToRedis, CHANNEL_GENERAL } from './redisChat';

import Message from '../models/Message';
import Notification from '../models/Notification';
import MutedUser from '../models/MutedUser';
import UserBlock from '../models/UserBlock';
import BannedUser from '../models/BannedUser';
import User from '../models/User';

import { setUserOnline } from './onlinePresence';
import { verifyToken } from '../controllers/JWT';
import { getGroupMembers } from './getGroupMembers';
import { censorMessage } from '../utils/censor';
import { logError } from '../utils/log';
import { getUserHistory } from './UserHistory';

import { handleInfractions } from './handlers/infractions';
import { broadcastMessage, sendToUser, setClient, getClientMap } from './ws-utils';

type BaseMessage = { type: string };
type InitMessage = { type: 'init' };
type ChatMessage = { type: 'message' | 'private_message' | 'group_message', content: string, to?: string, channelId?: string | number };
type CheckFriendsMessage = { type: 'check_friends', friends: string[] };
type GetHistoryMessage = { type: 'get_history' };
type Messages = InitMessage | ChatMessage | CheckFriendsMessage | GetHistoryMessage;

async function addUser(id: string): Promise<User | null> {
  return await User.findOne({ where: { id } });
}

// 📨 Fonction centralisée d'envoi de message
// 📨 Fonction centralisée d'envoi de message avec notifications offline
async function sendMessage({
  type,
  content,
  senderId,
  channelType,
  channelId,
  recipients
}: {
  type: string,
  content: string,
  senderId: string,
  channelType: 'public' | 'private' | 'group',
  channelId: number | string,
  recipients: string[]
}) {
  const channelPrefix = channelType === 'private'
    ? `private:${[senderId, channelId].sort().join(':')}`
    : channelType === 'group'
    ? `group:${channelId}`
    : CHANNEL_GENERAL;

  const messageObj = {
    id: uuidv4(),
    senderId,
    channel: channelPrefix,
    content,
    timestamp: new Date().toISOString(),
  };

  await addMessageToRedis(channelPrefix, messageObj);
  await Message.create({
    sender_id: senderId,
    channel_type: channelType,
    channel_id: typeof channelId === 'number' ? channelId : 0,
    content,
    created_at: new Date(),
  });

  // Récupérer le mappage des clients (utilisateurs en ligne)
  const clientMap = getClientMap();
  const validRecipients = recipients.filter(id => clientMap.has(id) && clientMap.get(id)?.readyState === 1);

  for (const recipientId of validRecipients) {
    sendToUser(recipientId, { type, ...messageObj });
  }

  // Gérer les utilisateurs hors ligne
  const offlineRecipients = recipients.filter(id => !validRecipients.includes(id));
  for (const recipientId of offlineRecipients) {
    await Notification.create({
      user_id: recipientId,
      type: 'message',
      message: JSON.stringify({ type, ...messageObj }),
      is_read: false,
      created_at: new Date(),
    });
  }
}

export async function handleWSConnection(ws: WebSocket, token: string) {
  const [userId, playerUsername] = verifyToken(token);
  if (!userId) {
    ws.send(JSON.stringify({ type: 'error', error: 'Invalid or missing token' }));
    ws.close();
    return;
  }

  const user = await addUser(userId);
  if (!user) {
    ws.send(JSON.stringify({ type: 'error', error: 'User not found' }));
    ws.close();
    return;
  }
 
  setClient(userId, ws);
  console.log("User connected:", userId);

  // Récupérer et envoyer les notifications/messages offline non lus
  const notifs = await Notification.findAll({ where: { user_id: userId, is_read: false } });
  for (const notif of notifs) {
    try {
      const payload = JSON.parse(notif.message);
      sendToUser(userId, payload);
      notif.is_read = true;
      await notif.save();
    } catch (e) {
      // Si le contenu n'est pas JSON, ignorer
    }
  }

  ws.on('message', async (data) => {
    let msg: Messages;
    try {
      msg = JSON.parse(data.toString()) as Messages;
    } catch {
      sendToUser(userId, { type: 'error', message: 'Invalid message format' });
      return;
    }

    if (['message', 'private_message', 'group_message'].includes(msg.type)) {
      const ban = await BannedUser.findOne({ where: { user_id: userId } });
      if (ban && ban.banned_until > new Date()) {
        sendToUser(userId, { type: 'error', error: 'Vous êtes banni.' });
        return;
      }
    }

    if (msg.type === 'init') {
      await setUserOnline(userId);
      return;
    }

    if (msg.type === 'message') {
      const { censored, count } = censorMessage(msg.content?.trim() || '');
      if (!censored) {
        sendToUser(userId, { type: 'error', error: 'Le message ne peut pas être vide.' });
        return;
      }

      await handleInfractions(userId, count, ws, 0);
      await sendMessage({
        type: 'message',
        content: censored,
        senderId: userId,
        channelType: 'public',
        channelId: 0,
        recipients: [...getClientMap().keys()],
      });
    }

    if (msg.type === 'private_message' && msg.to) {
      const blocked = await UserBlock.findOne({ where: { blocker_id: msg.to, blocked_id: userId } });
      if (blocked) {
        sendToUser(userId, { type: 'error', error: 'Vous êtes bloqué par cet utilisateur.' });
        return;
      }

      const { censored, count } = censorMessage(msg.content?.trim() || '');
      await handleInfractions(userId, count, ws, 0);

      await sendMessage({
        type: 'private_message',
        content: censored,
        senderId: userId,
        channelType: 'private',
        channelId: msg.to,
        recipients: [userId, msg.to],
      });
    }

    if (msg.type === 'group_message' && msg.channelId) {
      const mute = await MutedUser.findOne({ where: { user_id: userId, group_id: msg.channelId } });
      if (mute && mute.muted_until > new Date()) {
        sendToUser(userId, { type: 'error', error: 'Vous êtes temporairement mute dans ce groupe.' });
        return;
      }

      const { censored, count } = censorMessage(msg.content?.trim() || '');
      await handleInfractions(userId, count, ws, Number(msg.channelId));

      const members = await getGroupMembers(msg.channelId);
      await sendMessage({
        type: 'group_message',
        content: censored,
        senderId: userId,
        channelType: 'group',
        channelId: msg.channelId,
        recipients: members,
      });
    }
    if (msg.type === 'get_history') {
      const history = await getUserHistory(Number(userId), 'private', Number(userId));
      sendToUser(userId, { type: 'history', history });
    }
  });

  ws.on('close', () => {
    getClientMap().delete(userId);
    console.log("User disconnected:", userId);
  });
}
