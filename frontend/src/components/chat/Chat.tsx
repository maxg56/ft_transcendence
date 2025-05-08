import React from 'react';
import MessageList from './MessageList';
import { useChatWebSocket } from '@/context/ChatWebSocketContext';
import ChatInput from "./ChatInput";
import ConversationList from "./ConversationLists";

export const Chat: React.FC = () => {
  const { messages, sendMessage, channels, selectedChannel } = useChatWebSocket();
  const [newMessage, setNewMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  // const [searchTerm, setSearchTerm] = React.useState("");

  // Supprime cette ligne
  // setSearchTerm(searchTerm); // <-- Supprimer cela !

  if (!selectedChannel) return null;

  const currentChannel = channels.find(c => c.id === selectedChannel);
  const currentMessages = messages[selectedChannel] || [];

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessage(newMessage.trim());
    setNewMessage("");
  };

  const allChannelUsers = channels
    .map((c) => {
      if (c.type === "private" && c.id.startsWith("private:")) {
        return c.id.replace("private:", "");
      } else if (c.type === "group" && c.name) {
        return c.name;
      } else {
        return c.id;
      }
    })
    .filter((name, index, self) => self.indexOf(name) === index) // éviter les doublons
    // .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-[440px] h-[500px] rounded-lg shadow-lg
                  flex flex-col overflow-hidden bg-gradient-to-br
                  from-cyan-400/10 via-blue-500/10 backdrop-blur-md
                  border border-cyan-300/20 shadow-[0_0_15px_rgba(0,255,255,0.2)] 
                  text-black relative">
      <h2 className="text-center text-lg text-white font-semibold p-4 border-b">
        {currentChannel?.name || 'Chat'}
      </h2>
      {/* Scrollable content */}
      <div className="flex-1 px-2 py-1 overflow-auto pb-14">
        {open ? (
          <ConversationList allChannelUsers={allChannelUsers} setOpen={setOpen} />
        ) : (
          <MessageList messages={currentMessages} />
        )}
      </div>

      {/* Fixed input at the bottom */}
      <ChatInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
        setOpen={setOpen}
        open={open}
      />
    </div>
  );
};

export default Chat;
