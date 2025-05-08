import React from 'react';
import MessageList from './MessageList';
import { useChatWebSocket } from '@/context/ChatWebSocketContext';
import ChatInput from "./ChatInput";
import ConversationList from "./ConversationLists";

export const Chat: React.FC = () => {
  const { messages, sendMessage, channels, selectedChannel } = useChatWebSocket();
  const [newMessage, setNewMessage] = React.useState("");
  if (!selectedChannel) return null;
  const currentChannel = channels.find(c => c.id === selectedChannel);
  const currentMessages = messages[selectedChannel] || [];
  const [open, setOpen] = React.useState(false);
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    sendMessage(newMessage.trim());
    setNewMessage("");
  };
  return (
    <>
    
    <div className="w-[440px] h-[500px] rounded-lg shadow-lg flex flex-col overflow-hidden bg-gradient-to-br from-cyan-400/10 via-blue-500/10
                backdrop-blur-md border border-cyan-300/20 
                shadow-[0_0_15px_rgba(0,255,255,0.2)] 
                text-black">
        
        <h2 className="text-center text-lg text-white font-semibold p-4 border-b "> 
          {currentChannel?.name || 'Chat'}
        </h2>
      
      <div className="flex flex-row overflow-auto">
      <div className="flex flex-col overflow-auto">
        {open ? (
        <div className="flex flex-col overflow-auto w-[800px]">
          <ConversationList/>
        </div>
      ) : (
        <MessageList messages={currentMessages} />
      )}
        <ChatInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
          setOpen={setOpen}
          open={open}
          />
      </div>
      </div>
    </div>
    </>
  );
};

export default Chat;
