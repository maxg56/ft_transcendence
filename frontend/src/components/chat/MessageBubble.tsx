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
      <div className="flex flex-col max-w-[70%] ">
        {!isOwnMessage && (
          <div className="text-[10px] text-cyan-300 mb-1 font-semibold">
            {senderUsername}
          </div>
        )}
        <div
          className={`p-2 rounded-md font-normal border break-words whitespace-pre-wrap
            backdrop-blur-md shadow-[0_0_10px_rgba(0,255,255,0.2)] transition duration-300
            ${isOwnMessage
              ? "bg-gradient-to-r from-purple-500/60 to-purple-600/60 border-purple-400/50"
              : "bg-gradient-to-r from-cyan-500/60 to-cyan-600/60 border-cyan-400/50"
            }`}
        >
          <div className="text-sm text-white">{content}</div>
        </div>
        {formattedTimestamp && (
          <div className="text-[9px] text-cyan-200 text-right mt-1">
            {formattedTimestamp}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
