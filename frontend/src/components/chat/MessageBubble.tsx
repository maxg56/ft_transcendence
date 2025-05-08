import React from "react";

interface MessageBubbleProps {
  content: string;
  senderUsername: string;
  isOwnMessage?: boolean;
  formattedTimestamp?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  senderUsername,
  isOwnMessage = false,
  formattedTimestamp,
}) => {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-2 max-w-[70%] text-sm rounded-md font-normal border break-words whitespace-pre-wrap
        ${isOwnMessage
          ? "bg-purple-500/60  to-purple-600/60 border-purple-500 border"
          : "bg-cyan-500/60  to-cyan-600/60 border-cyan-500 border"
        }`}
      >
        {!isOwnMessage && (
          <div className="text-[9px] text-gray-400 mb-1">{senderUsername}</div>
        )}
        <div className="text-sm text-white">{content}</div>
        {formattedTimestamp && (
          <div className="text-[9px] text-gray-400 text-right mt-1">{formattedTimestamp}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

