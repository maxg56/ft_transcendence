import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';

interface Message {
  id: string;
  senderId: number;
  senderUsername: string;
  receiverId?: number;
  receiverUsername?: string;
  content: string;
  timestamp: string;
  formattedTimestamp?: string;
  channelId: number | string;
  channelType: 'public' | 'private' | 'group';
  isOwnMessage?: boolean;
  status?: 'delivered' | 'read' | 'failed';
}

interface Channel {
  id: string;
  name: string;
  type: 'general' | 'group' | 'private';
}

interface ChatContextType {
  ws: WebSocket | null;
  channels: Channel[];
  messages: Record<string, Message[]>;
  unread: Record<string, number>;
  selectedChannel: string | null;
  selectChannel: (id: string) => void;
  sendMessage: (content: string) => void;
  initiatePrivate: (friend: { id: number; username: string }) => void;
  blockUser: (userId: number) => void;
  unblockUser: (userId: number) => void;
  invitePong: (toUsername: string) => void;
  fetchProfile: (userId: number) => void;
  profile: any | null;
  clearProfile: () => void;
  loading: boolean;
}

const ChatWebSocketContext = createContext<ChatContextType | undefined>(undefined);

const WS_CONFIG = {
  protocol: 'wss',
  port: import.meta.env.VITE_PORT_PRODE || '8443',
  host: import.meta.env.VITE_HOSTNAME || 'localhost',
  path: '/ws/chat',
  maxRetries: 5,
  baseDelay: 1000,
};

const isMessageType = (type: string): boolean =>
  ['message', 'private_message', 'group_message'].includes(type);

export const ChatWebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [channels, setChannels] = useState<Channel[]>([{ id: 'general', name: 'General', type: 'general' }]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({ general: [] });
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const manuallyClosed = useRef(false);
  const token = Cookies.get('token');

  const connect = () => {
    if (!token) {
      console.warn("No token found, Chat WebSocket connection aborted.");
      return;
    }

    const { protocol, host, port, path } = WS_CONFIG;
    const ws = new WebSocket(`${protocol}://${host}:${port}${path}?token=${token}`);
    wsRef.current = ws;
    setSocket(ws);

    ws.onopen = () => {
      console.log("Chat WebSocket connected");
      retryCountRef.current = 0;
      setLoading(false);
      ws.send(JSON.stringify({ type: 'init'}));
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'channels') {
        const serverChannels: string[] = data.channels;
        const mappedChannels: Channel[] = serverChannels.map(key => {
          if (key === 'general') return { id: 'general', name: 'General', type: 'general' };
          if (key.startsWith('group:')) {
            const id = key.split(':')[1];
            return { id: key, name: `Groupe ${id}`, type: 'group' };
          }
          if (key.startsWith('private:')) {
            const parts2 = key.split(':');
            const partner2 = parts2[parts2.length - 1];
            return { id: key, name: `Privé avec ${partner2}`, type: 'private' };
          }
          return { id: key, name: key, type: 'general' };
        });
        setChannels(mappedChannels);
        setMessages(prev => {
          const copy = { ...prev };
          serverChannels.forEach(c => { if (!copy[c]) copy[c] = []; });
          return copy;
        });
        serverChannels.forEach(c => ws.send(JSON.stringify({ type: 'get_history', channel: c })));
        return;
      }

      if (isMessageType(data.type)) {
        // Derive unified channel key
        const channelTypeKey = data.type === 'private_message' ? 'private'
          : data.type === 'group_message' ? 'group' : 'general';
        const channelKey = channelTypeKey === 'general'
          ? 'general'
          : `${channelTypeKey}:${channelTypeKey === 'private' ? data.receiverUsername : data.channelId}`;
        // Add channel if new
        if (!channels.some(c => c.id === channelKey)) {
          const channelName =
            channelTypeKey === 'private'
              ? `Privé avec ${data.receiverUsername}`
              : channelTypeKey === 'group'
              ? `Groupe ${data.channelId}`
              : 'General';
          setChannels(prev => [...prev, { id: channelKey, name: channelName, type: channelTypeKey }]);
          setMessages(prev => ({ ...prev, [channelKey]: [] }));
          ws.send(JSON.stringify({ type: 'get_history', channel: channelKey }));
        }
      }

      if (data.type === 'history') {
        if (Array.isArray(data.history)) {
          const sortedMessages = [...data.history].sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
      
          setMessages((prev) => ({
            ...prev,
            [data.channel]: sortedMessages,
          }));
        } else {
          console.warn(`Erreur: 'data.history' est indéfini ou mal formé pour le canal ${data.channel}`);
          setMessages((prev) => ({
            ...prev,
            [data.channel]: [], // Initialiser avec un tableau vide si messages non définis
          }));
        }
      
        setLoading(false);
        return;
      }
      
      

      if (isMessageType(data.type)) {
        const newMessage: Message = {
          id: data.id,
          senderId: data.senderId,
          senderUsername: data.senderUsername,
          receiverId: data.receiverId,
          receiverUsername: data.receiverUsername,
          content: data.content,
          timestamp: data.timestamp,
          formattedTimestamp: data.formattedTimestamp,
          channelId: data.channelId,
          channelType: data.channelType,
          isOwnMessage: data.isOwnMessage,
          status: data.status,
        };
        // Derive channel key for appending
        const channelTypeKey = data.type === 'private_message' ? 'private'
          : data.type === 'group_message' ? 'group' : 'general';
        const channelKey = channelTypeKey === 'general'
          ? 'general'
          : `${channelTypeKey}:${channelTypeKey === 'private' ? data.receiverUsername : data.channelId}`;
        setMessages(prev => ({
          ...prev,
          [channelKey]: [...(prev[channelKey] || []), newMessage]
        }));

        if (channelKey !== selectedChannel) {
          setUnread(prev => ({
            ...prev,
            [channelKey]: (prev[channelKey] || 0) + 1
          }));
        }
        return;
      }

      if (data.type === 'error') {
        console.warn("Erreur WebSocket reçue :", data.error);
        // TODO: Remplacer par une notification UI (toast, snackbar, etc.)
      }

      if (data.type === 'private:channel') {
        const channel = data.channel as string;
        const parts = channel.split(':');
        const partner = parts[parts.length - 1];
        setChannels(prev => prev.some(c => c.id === channel)
          ? prev
          : [...prev, { id: channel, name: `Privé avec ${partner}`, type: 'private' }]
        );
        setMessages(prev => ({ ...prev, [channel]: [] }));
        setSelectedChannel(channel);
        setUnread(prev => { const copy = { ...prev }; delete copy[channel]; return copy; });
        ws.send(JSON.stringify({ type: 'get_history', channel }));
        return;
      }

      if (data.type === 'block_user:success') {
        console.log(`Blocked user ${data.userId}`);
      }
      if (data.type === 'unblock_user:success') {
        console.log(`Unblocked user ${data.userId}`);
      }
      if (data.type === 'pong_invite') {
        console.log('Received Pong invite', data.invitation);
        // Optionally: update UI or notifications
      }
      if (data.type === 'pong_invite:sent') {
        console.log(`Pong invite sent to ${data.to}`);
      }
      if (data.type === 'profile') {
        setProfile(data.profile);
        // Optionally: display profile modal
      }
    };

    ws.onclose = () => {
      setSocket(null);
      if (!manuallyClosed.current && retryCountRef.current < WS_CONFIG.maxRetries) {
        const delay = WS_CONFIG.baseDelay * 2 ** retryCountRef.current;
        console.warn(`🔁 Chat WS reconnect in ${delay / 1000}s...`);
        reconnectTimeout.current = setTimeout(() => {
          retryCountRef.current++;
          connect();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error("Chat WebSocket error:", error);
    };
  };

  useEffect(() => {
    manuallyClosed.current = false;
    connect();
    return () => {
      manuallyClosed.current = true;
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      wsRef.current?.close();
    };
  }, [token]);

  const selectChannel = (id: string) => {
    setSelectedChannel(id);
    setUnread(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const sendMessage = (content: string) => {
    if (!wsRef.current || !selectedChannel) return;

    let payload: any = { content, type: 'message', channel: selectedChannel };

    if (selectedChannel === 'general') {
      payload.type = 'message';
    } else if (selectedChannel.startsWith('group:')) {
      payload.type = 'group_message';
      payload.channelId = selectedChannel.replace('group:', '');
      payload.channel = selectedChannel;
    } else if (selectedChannel.startsWith('private:')) {
      payload.type = 'private_message';
      payload.to = selectedChannel.replace('private:', '');
      payload.channel = selectedChannel;
    }

    wsRef.current.send(JSON.stringify(payload));
  };

  const initiatePrivate = (friend: { id: number; username: string }) => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: 'private:initiate', friendId: friend.id }));
  };

  const blockUser = (userId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'block_user', userId }));
    }
  };

  const unblockUser = (userId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'unblock_user', userId }));
    }
  };

  const invitePong = (toUsername: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'pong_invite', to: toUsername }));
    }
  };

  const fetchProfile = (userId: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'fetch_profile', userId }));
    }
  };

  const clearProfile = () => setProfile(null);

  return (
    <ChatWebSocketContext.Provider
      value={{
        ws: socket,
        channels,
        messages,
        unread,
        selectedChannel,
        selectChannel,
        sendMessage,
        initiatePrivate,
        blockUser,
        unblockUser,
        invitePong,
        fetchProfile,
        profile,
        clearProfile,
        loading,
      }}
    >
      {children}
    </ChatWebSocketContext.Provider>
  );
};

export function useChatWebSocket() {
  const ctx = useContext(ChatWebSocketContext);
  if (!ctx) throw new Error('useChatWebSocket must be used within ChatWebSocketProvider');
  return ctx;
}
