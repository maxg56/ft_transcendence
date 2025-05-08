import redis from '../../config/client';
import Notification from '../../models/Notification';

export async function deleteNotification(userId: string, notificationId: number) {
    // Supprimer la notification de la base de données
    await Notification.destroy({ where: { id: notificationId, user_id: userId } });
  
    // Effacer la cache Redis
    redis.del(`notifications:${userId}`, (err, response) => {
      if (err) {
        console.log('Erreur lors de la suppression de la cache Redis:', err);
      }
      console.log('Cache Redis supprimée:', response);
    });
}
  