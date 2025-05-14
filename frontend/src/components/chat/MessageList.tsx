import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface Message {
  id?: string | number;
  senderId: number;
  content: string;
  senderUsername: string;
  isOwnMessage?: boolean;
  formattedTimestamp?: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // console.log("message:", messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id ?? index}
          senderId={msg.senderId}
          content={msg.content}
          senderUsername={msg.senderUsername}
          isOwnMessage={msg.isOwnMessage}
          formattedTimestamp={msg.formattedTimestamp}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
