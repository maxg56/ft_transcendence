import { useWebSocket } from "@/context/WebSocketContext";

export const useSendWSMessage = () => {
  const { socket } = useWebSocket();  // Correctement destructuré depuis useWebSocket

  const sendMessage = (data: Record<string, any>) => {
    if (!socket) {
      console.error("WebSocket non initialisé");
      return;
    }
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket non prêt");
    }
  };

  return sendMessage;
};
