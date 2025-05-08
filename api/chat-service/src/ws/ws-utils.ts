import { WebSocket } from 'ws';
const clients = new Map<string, WebSocket>();

export function setClient(userId: string, ws: WebSocket) {
  clients.set(userId, ws);
}

export function sendToUser(userId: string, payload: object) {
  const client = clients.get(userId);
  if (client && client.readyState === 1) {
    client.send(JSON.stringify(payload));
  }
}

export function broadcastMessage(userIds: string[], payload: object) {
  for (const id of userIds) {
    sendToUser(id, payload);
  }
}

export function getClientMap() {
  return clients;
}
