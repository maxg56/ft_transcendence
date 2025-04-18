// hooks/useSendWSMessage.ts
import { useWebSocket } from "../context/WebSocketContext";

export const useSendWSMessage = () => {
  const socket = useWebSocket();

  const sendMessage = (data: Record<string, any>) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not ready");
    }
  };

  return sendMessage;
};
