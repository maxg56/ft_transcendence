import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      console.warn("No token found, WebSocket connection aborted.");
      return;
    }
    
    const protocol = "wss";
    const port = "8443";

    const ws = new WebSocket(
      `${protocol}://${window.location.hostname}:${port}/ws/game?token=${token}`
    );

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };
    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };
    ws.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    socketRef.current = ws;
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [token]);

  return (
    <WebSocketContext.Provider value={socket}>
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
