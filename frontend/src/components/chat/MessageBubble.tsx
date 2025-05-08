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
          ? "bg-blue-100 text-black border-blue-200"
          : "bg-gray-100 text-black border-gray-200"
        }`}
      >
        {!isOwnMessage && (
          <div className="text-[9px] text-gray-400 mb-1">{senderUsername}</div>
        )}
        <div>{content}</div>
        {formattedTimestamp && (
          <div className="text-[9px] text-gray-400 text-right mt-1">{formattedTimestamp}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

