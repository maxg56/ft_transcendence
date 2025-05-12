import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Cookies from "js-cookie";


type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (msg: string) => void;
  addMessageListener: (cb: (msg: any) => void) => () => void;
};


const WebSocketContext = createContext<WebSocketContextType | null>(null);

const WS_CONFIG = {
  protocol: "wss",
  port: import.meta.env.VITE_PORT_PRODE || "8443",
  host: import.meta.env.VITE_HOSTNAME || "localhost",
  path: "/ws/game",
  maxRetries: 5,
  baseDelay: 1000, // ms
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const retryCount = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const manuallyClosed = useRef(false);
  const socketRef = useRef<WebSocket | null>(null);
  const listeners = useRef<((msg: any) => void)[]>([]);
  const token = Cookies.get("token");


  const connect = () => {
    if (!token) {
      console.warn("No token found, WebSocket connection aborted.");
      return;
    }

    const { protocol, host, port, path } = WS_CONFIG;
    const ws = new WebSocket(`${protocol}://${host}:${port}${path}?token=${token}`);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      retryCount.current = 0;
      setSocket(ws);
      socketRef.current = ws;
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
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
        listeners.current.forEach((listener) => listener(data));
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const addMessageListener = (listener: (msg: any) => void) => {
    listeners.current.push(listener);
    return () => {
      listeners.current = listeners.current.filter(l => l !== listener);
    };
  };
  

  useEffect(() => {
    manuallyClosed.current = false;
    connect();

    return () => {
      manuallyClosed.current = true;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      socketRef.current?.close();
    };
  }, [token]);

  const sendMessage = (msg: string) => {

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
    } else {
      console.warn("⚠️ Cannot send message: WebSocket not connected.");
    }
  };
  
  return (
    <WebSocketContext.Provider 
    value={{ 
      socket,
      isConnected: socket?.readyState === WebSocket.OPEN,
      sendMessage,
      addMessageListener
      }}>
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

