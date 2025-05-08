import React from "react";
import { useChatWebSocket } from "@/context/ChatWebSocketContext";

interface ConversationListProps {
  allChannelUsers: string[];
  setOpen: (open: boolean) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ allChannelUsers, setOpen }) => {
  const { channels, selectedChannel, selectChannel, unread } = useChatWebSocket();

  const handleClose = (channelKey: string) => {
    setOpen(false);
    selectChannel(channelKey);
  };

  return (
    <div className="w-full border-r overflow-y-auto flex flex-col p-2 gap-2">
      {allChannelUsers.length === 0 ? (
        <div className="text-center text-sm text-gray-500 mt-4">Aucun résultat</div>
      ) : (
        allChannelUsers.map((name) => {
          const channelKey = channels.find((c) => c.id === (c.type === "private" ? `private:${name}` : name))?.id;
          if (!channelKey) return null;
          return (
            <div
              key={channelKey}
              onClick={() => handleClose(channelKey)} // Removed extra }
              className={`p-3 rounded-md ${
                selectedChannel === channelKey ? "bg-cyan-600/60 font-semibold" : "hover:bg-cyan-500/10"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="text-sm text-white font-semibold">
                  {name}
                </div>

                {unread[channelKey] ? (
                  <div className="w-2 h-3 rounded-full bg-red-500 ml-2" />
                ) : null}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ConversationList;
