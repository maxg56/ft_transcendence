import redis from '../../config/client';
import Notification from '../../models/Notification';

export async function getNotifications(userId: string): Promise<Notification[]> {
  return new Promise((resolve, reject) => {
    redis.get(`notifications:${userId}`, async (err, result) => {
      if (err) {
        return reject(err);
      }
      
      if (result) {
        // Si les notifications sont présentes dans Redis, les retourner
        return resolve(JSON.parse(result));
      } else {
        // Si pas présentes, aller les chercher dans la base de données
        const notifications = await Notification.findAll({ where: { user_id: userId } });
        // Stocker les notifications dans Redis pendant 1 heure (3600 secondes)
        redis.setex(`notifications:${userId}`, 3600, JSON.stringify(notifications));
        // Retourner les notifications récupérées
        return resolve(notifications);
      }
    });
  });
}
