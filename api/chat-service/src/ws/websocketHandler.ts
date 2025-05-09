import { WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

import { addMessageToRedis, CHANNEL_GENERAL } from './redisChat';

import Message from '../models/Message';
import Notification from '../models/Notification';
import MutedUser from '../models/MutedUser';
import UserBlock from '../models/UserBlock';
import BannedUser from '../models/BannedUser';
import User from '../models/User';
import ChatGroupMember from '../models/ChatGroupMember';
import Friendship from '../models/Friendship';

import { setUserOnline, setUserOffline } from './onlinePresence';
import { verifyToken } from '../controllers/JWT';
import { censorMessage } from '../utils/censor';
import { getUserHistory } from './UserHistory';
import { Op } from 'sequelize';
import { getPrivateChannel } from '../utils/channel';


import { handleInfractions } from './handlers/infractions';
import { broadcastMessage, sendToUser, setClient, getClientMap } from './ws-utils';

type BaseMessage = { type: string };
type InitMessage = { type: 'init' };
type ChatMessage = { type: 'message' | 'private_message' | 'group_message', content: string, to?: string, channelId?: string | number };
type CheckFriendsMessage = { type: 'check_friends', friends: string[] };
type GetHistoryMessage = { type: 'get_history'; channel: string };
type PrivateInitiateMessage = { type: 'private:initiate'; friendId: number };
type BlockUserMessage = { type: 'block_user' | 'unblock_user'; userId: number };
type PongInviteMessage = { type: 'pong_invite'; to: string };
type FetchProfileMessage = { type: 'fetch_profile'; userId: number };
type Messages = InitMessage | ChatMessage | CheckFriendsMessage | GetHistoryMessage | PrivateInitiateMessage | BlockUserMessage | PongInviteMessage | FetchProfileMessage;

async function addUser(id: string): Promise<User | null> {
  return await User.findOne({ where: { id } });
}

// Fonction centralisée d'envoi de message
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
    ? `private:${channelId}`
    : channelType === 'group'
    ? `group:${channelId}`
    : CHANNEL_GENERAL;

  const user = await addUser(senderId);
  const messageObj = {
    id: uuidv4(),
    senderId,
    senderUsername: user?.username || 'Unknown',
    channelType,
    channelId,
    content,
    timestamp: new Date().toISOString(),
  };

  await addMessageToRedis(channelPrefix, messageObj);
  await Message.create({
    sender_id: senderId,
    channel_type: channelType,
    channel_id: Number(channelId),
    content,
    created_at: new Date(),
  });

  const clientMap = getClientMap();
  const validRecipients: string[] = [];
  for (const id of recipients) {
    // skip if offline
    if (!clientMap.has(id) || clientMap.get(id)?.readyState !== 1) continue;
    // skip if sender blocked recipient or vice versa
    const blockedBySender = await UserBlock.findOne({ where: { blocker_id: senderId, blocked_id: id } });
    const blockedByRecipient = await UserBlock.findOne({ where: { blocker_id: id, blocked_id: senderId } });
    if (blockedBySender || blockedByRecipient) continue;
    validRecipients.push(id);
  }

  let partnerId: string | undefined;
  if (channelType === 'private') {
    partnerId = recipients.find(id => id !== senderId);
  }

  for (const recipientId of validRecipients) {
    let otherId = recipientId;
    if (channelType === 'private' && partnerId) {
      otherId = recipientId === senderId ? partnerId : senderId;
    }
    const receiverUser = await addUser(otherId);
    const formattedTimestamp = new Date(messageObj.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    sendToUser(recipientId, {
      type,
      ...messageObj,
      isOwnMessage: recipientId === senderId,
      receiverId: Number(otherId),
      receiverUsername: receiverUser?.username || 'Unknown',
      formattedTimestamp,
      status: 'delivered'
    });
  }

  const offlineRecipients = recipients.filter(id => !validRecipients.includes(id));
  for (const recipientId of offlineRecipients) {
    const receiverUser = await addUser(recipientId);
    const formattedTimestamp = new Date(messageObj.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await Notification.create({
      user_id: recipientId,
      type: 'message',
      message: JSON.stringify({
        type,
        ...messageObj,
        isOwnMessage: recipientId === senderId,
        receiverId: recipientId,
        receiverUsername: receiverUser?.username || 'Unknown',
        formattedTimestamp,
        status: 'sent'
      }),
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

  ws.on('message', async (raw) => {
    let msg: Messages;
    try {
      msg = JSON.parse(raw.toString()) as Messages;
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

      const privateRecords = await Message.findAll({
        attributes: ['sender_id'],
        where: { channel_type: 'private', [Op.or]: [{ sender_id: +userId }] },
        group: ['sender_id'],
      });
      const privatePartners = new Set<number>();
      privateRecords.forEach(m => {
        const p = m.sender_id === +userId ? m.channel_id : m.sender_id;
        privatePartners.add(p);
      });
      // Fetch usernames of private partners
      const partnerUsers = await User.findAll({ where: { id: Array.from(privatePartners) } });
      const privateChannels = partnerUsers.map(u =>
        `private:${[playerUsername, u.username].sort().join('-')}`
      );
      const channels = [CHANNEL_GENERAL, ...privateChannels];
      sendToUser(userId, { type: 'channels', channels });
      return;
    }

    if (msg.type === 'private:initiate') {
      const { friendId } = msg;
      // Vérifier amitié
      const isFriend = await Friendship.findOne({ where: { user1: Number(userId), user2: friendId, status: 'accepted' } });
      if (!isFriend) {
        ws.send(JSON.stringify({ type: 'error', error: 'Not your friend' }));
        return;
      }
      const friendUser = await User.findByPk(friendId);
      if (!friendUser) {
        ws.send(JSON.stringify({ type: 'error', error: 'User not found' }));
        return;
      }
      // PlayerUsername from verifyToken
      const channel = getPrivateChannel(playerUsername, friendUser.username);
      ws.send(JSON.stringify({ type: 'private:channel', channel }));
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
      const otherUser = await User.findOne({ where: { username: msg.to } });
      if (!otherUser) {
        sendToUser(userId, { type: 'error', error: 'Utilisateur introuvable.' });
        return;
      }
      const partnerId = String(otherUser.id);
      const blocked = await UserBlock.findOne({ where: { blocker_id: partnerId, blocked_id: userId } });
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
        channelId: partnerId,
        recipients: [userId, partnerId],
      });
    }
    if (msg.type === 'get_history') {
      // Extract channel key and parse
      const { channel } = msg as GetHistoryMessage;
      let history;
      if (channel === CHANNEL_GENERAL) {
        history = await getUserHistory(Number(userId), 'public', 0);
      } else if (channel.startsWith('private:')) {
        const partnerName = channel.split(':')[1];
        const otherUser = await User.findOne({ where: { username: partnerName } });
        if (otherUser) {
          history = await getUserHistory(Number(userId), 'private', otherUser.id);
        } else {
          history = [];
        }
      } else if (channel.startsWith('group:')) {
        const groupId = channel.split(':')[1];
        history = await getUserHistory(Number(userId), 'group', Number(groupId));
      }
      // Send back history with channel key
      sendToUser(userId, { type: 'history', channel, history });
    }

    // Block/unblock users
    if (msg.type === 'block_user' && (msg as BlockUserMessage).userId) {
      const targetId = (msg as BlockUserMessage).userId;
      // avoid duplicate blocks
      const [block, created] = await UserBlock.findOrCreate({
        where: { blocker_id: userId, blocked_id: String(targetId) }
      });
      sendToUser(userId, { type: 'block_user:success', userId: targetId, alreadyBlocked: !created });
      return;
    }
    if (msg.type === 'unblock_user' && (msg as BlockUserMessage).userId) {
      const targetId = (msg as BlockUserMessage).userId;
      await UserBlock.destroy({ where: { blocker_id: userId, blocked_id: String(targetId) } });
      sendToUser(userId, { type: 'unblock_user:success', userId: targetId });
      return;
    }

    // Pong game invite
    if (msg.type === 'pong_invite' && (msg as PongInviteMessage).to) {
      const otherUser = await User.findOne({ where: { username: (msg as PongInviteMessage).to } });
      if (!otherUser) {
        sendToUser(userId, { type: 'error', error: 'Utilisateur introuvable.' });
        return;
      }
      const invitation = { from: userId, to: String(otherUser.id), timestamp: new Date().toISOString() };
      await Notification.create({ user_id: otherUser.id, type: 'pong_invite', message: JSON.stringify(invitation), is_read: false, created_at: new Date() });
      sendToUser(String(otherUser.id), { type: 'pong_invite', invitation });
      sendToUser(userId, { type: 'pong_invite:sent', to: otherUser.id });
      return;
    }

    // Fetch user profile
    if (msg.type === 'fetch_profile' && (msg as FetchProfileMessage).userId) {
      const profileUser = await User.findByPk((msg as FetchProfileMessage).userId);
      if (!profileUser) {
        sendToUser(userId, { type: 'error', error: 'User not found.' });
        return;
      }
      const profile = { id: profileUser.id, username: profileUser.username, avatar: profileUser.avatar, elo: profileUser.elo };
      sendToUser(userId, { type: 'profile', profile });
      return;
    }
  });

  ws.on('close', () => {
    setUserOffline(userId);
    getClientMap().delete(userId);
    console.log("User disconnected:", userId);
  });
}
