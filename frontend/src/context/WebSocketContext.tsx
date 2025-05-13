import React, { createContext, useContext, useEffect, useRef, useState, FC } from "react";
import Cookies from "js-cookie";

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (msg: string) => void;
  addMessageListener: (cb: (msg: any) => void) => () => void;
  addEventListener: (event: string, cb: (msg: any) => void) => () => void;
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
  const listeners = useRef<((msg: any) => void)[]>([]);
  const typedListeners = useRef<Map<string, ((msg: any) => void)[]>>(new Map());

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
      console.log("✅ WebSocket connected");
      retryCount.current = 0;
      setSocket(ws);
      socketRef.current = ws;
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
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
        if (data.event !== "game_state"){
          console.log("📩 WebSocket received:", data);
        }

        // Generic listeners
        listeners.current.forEach((listener) => {
          try {
            listener(data);
          } catch (e) {
            console.error("Generic listener error:", e);
          }
        });

        // Typed listeners
        const eventName = data?.event;
        if (eventName && typedListeners.current.has(eventName)) {
          typedListeners.current.get(eventName)?.forEach((cb) => {
            try {
              cb(data);
            } catch (e) {
              console.error(`Listener for ${eventName} error:`, e);
            }
          });
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
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
    } else {
      console.warn("⚠️ Cannot send message: WebSocket not connected.");
    }
  };

  const addMessageListener = (listener: (msg: any) => void) => {
    listeners.current.push(listener);
    return () => {
      listeners.current = listeners.current.filter((l) => l !== listener);
    };
  };

  const addEventListener = (event: string, cb: (data: any) => void) => {
    if (!typedListeners.current.has(event)) {
      typedListeners.current.set(event, []);
    }
    typedListeners.current.get(event)!.push(cb);

    return () => {
      const arr = typedListeners.current.get(event);
      if (arr) {
        typedListeners.current.set(
          event,
          arr.filter((fn) => fn !== cb)
        );
      }
    };
  };

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
        addMessageListener,
        addEventListener,
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
