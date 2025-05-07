import { getRecentMessages } from './redisChat';
import Notification from '../models/Notification';

export async function getUserHistory(userId: number, channelType: string, channelId: number | string, pageSize: number = 50) {
    let channelKey: string;
    if (channelType === 'private') {
      channelKey = `private:${[userId, channelId].sort().join(':')}`;
    } else if (channelType === 'group') {
      channelKey = `group:${channelId}`;
    } else {
      channelKey = 'general';
    }
  
    let redisMessages: any[] = [];
    try {
      redisMessages = await getRecentMessages(channelKey); // Ajout d'une pagination ici
    } catch (error) {
      console.error(`Erreur lors de la récupération des messages Redis: ${error}`);
      // Optionnel: retourne une liste vide ou gère autrement l'erreur
    }
  
    let missedPrivateMessages: any[] = [];
    if (channelType === 'private') {
      try {
        const notifs = await Notification.findAll({
          where: {
            user_id: userId,
            type: 'message',
            is_read: false,
          }
        });
  
        missedPrivateMessages = notifs
          .map(n => {
            try {
              const obj = JSON.parse(n.message);
              if (obj.channel === channelKey) return obj;
            } catch (error) {
              console.error('Erreur de parsing du message de notification:', error);
            }
            return null;
          })
          .filter(Boolean);
      } catch (error) {
        console.error(`Erreur lors de la récupération des notifications: ${error}`);
      }
    }
  
    const allMessages = [...redisMessages, ...missedPrivateMessages];
    allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
    return allMessages;
  }
  