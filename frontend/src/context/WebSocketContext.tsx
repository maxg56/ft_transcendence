import React, { createContext, useContext, useEffect, useRef, useState, FC } from "react";
import Cookies from "js-cookie";

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (msg: string) => void;
  dequeueMessage: () => any | undefined;
  queueLength: number;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const WS_CONFIG = {
  protocol: "wss",
  port: import.meta.env.VITE_PORT_PRODE || "8443",
  host: import.meta.env.VITE_HOSTNAME || "localhost",
  path: "/ws/game",
  maxRetries: 5,
  baseDelay: 1000,
};

const buildWsUrl = (token: string) =>
  `${WS_CONFIG.protocol}://${WS_CONFIG.host}:${WS_CONFIG.port}${WS_CONFIG.path}?token=${token}`;

export const WebSocketProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const retryCount = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const manuallyClosed = useRef(false);

  const socketRef = useRef<WebSocket | null>(null);
  const messageQueue = useRef<any[]>([]);
  const sendQueue = useRef<string[]>([]);
  const tokenRef = useRef(Cookies.get("token") || "");

  useEffect(() => {
    tokenRef.current = Cookies.get("token") || "";
  }, [Cookies.get("token")]);

  const connect = () => {
    const token = tokenRef.current;
    if (!token) {
      console.warn("No token found, WebSocket connection aborted.");
      return;
    }

    const ws = new WebSocket(buildWsUrl(token));

    ws.onopen = () => {
      retryCount.current = 0;
      setSocket(ws);
      socketRef.current = ws;
      setIsConnected(true);
      while (sendQueue.current.length > 0 && ws.readyState === WebSocket.OPEN) {
        const msg = sendQueue.current.shift()!;
        ws.send(msg);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);

      if (!manuallyClosed.current && retryCount.current < WS_CONFIG.maxRetries) {
        const delay = WS_CONFIG.baseDelay * 2 ** retryCount.current;
        console.warn(`🔁 Reconnecting in ${delay / 1000}s...`);

        reconnectTimeout.current = setTimeout(() => {
          retryCount.current++;
          connect();
        }, delay);
      }
    };

    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event !== 'game_state') {
          messageQueue.current.push(data);
        }
      } catch (err) {
        console.error("❗ WebSocket message parse error:", err);
      }
    };
    ws.onerror = (event) => {
      console.error("⚠️ WebSocket error", {
        readyState: ws.readyState,
        event,
      });
    };
  };

  const sendMessage = (msg: string) => {
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    } else {
      console.warn("⚠️ WebSocket not open, queueing message.");
      sendQueue.current.push(msg);
    }
  };

  const dequeueMessage = () => messageQueue.current.shift();
  const queueLength = messageQueue.current.length;

  useEffect(() => {
    manuallyClosed.current = false;
    connect();

    return () => {
      manuallyClosed.current = true;
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      socketRef.current?.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        sendMessage,
        dequeueMessage,
        queueLength,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
