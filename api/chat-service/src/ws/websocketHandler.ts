// src/ws/websocketHandler.ts
import { WebSocket } from 'ws';
import { setUserOnline, setUserOffline, getFriendsOnlineStatus } from '../controllers/presenceManager';
// import { getPrivateChannel } from '../channels/privateChannelManager';

type Message = {
  type: 'message' | 'private_message' | 'check_friends' | 'init' | 'get_history',
  to?: string,
  content?: string,
  friends?: string[]
};

const clients = new Map<string, WebSocket>();

export function handleWSConnection(ws: WebSocket) {
  let userId: string;

  ws.on('message', async (data) => {
    const msg = JSON.parse(data.toString()) as Message;

    if (msg.type === 'init') {
      userId = msg.content!;
      clients.set(userId, ws);
      await setUserOnline(userId);
      return;
    }

    if (msg.type === 'message') {
      // Broadcast to everyone
      clients.forEach(c => c !== ws && c.send(JSON.stringify({ from: userId, content: msg.content })));
    }


    if (msg.type === 'check_friends' && msg.friends) {
      const statuses = await getFriendsOnlineStatus(msg.friends);
      ws.send(JSON.stringify({ type: 'friends_status', statuses }));
    }

    if (msg.type === 'get_history') {
        // const history = await prisma.message.findMany({
        //   where: msg.to
        //     ? { OR: [{ from: userId, to: msg.to }, { from: msg.to, to: userId }] }
        //     : { to: null },
        //   orderBy: { timestamp: 'asc' },
        //   take: 50,
        // });
      
        // ws.send(JSON.stringify({ type: 'history', messages: history }));
      }
      
  });

  ws.on('close', () => {
    if (userId) {
      clients.delete(userId);
      setUserOffline(userId);
    }
  });
}
