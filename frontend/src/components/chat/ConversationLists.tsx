import React, { useState } from "react";
import { useChatWebSocket } from "@/context/ChatWebSocketContext";
import FriendSearch from "./FriendSearch";

const ConversationList: React.FC = () => {
  const { channels, selectedChannel, selectChannel, unread } = useChatWebSocket();
  const [searchTerm, setSearchTerm] = useState("");

  // On extrait tous les noms de canaux (groupes, privés, etc.)
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
    .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full border-r overflow-y-auto bg-gray-200 rounded-2xl flex flex-col p-2 gap-2">
      <input
        type="text"
        placeholder="Nom du canal ou utilisateur..."
        className="w-full px-2 py-2 border border-gray-300 rounded-md text-xs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FriendSearch/>
      {allChannelUsers.length === 0 ? (
        <div className="text-center text-sm text-gray-500 mt-4">Aucun résultat</div>
      ) : (
        allChannelUsers.map((name) => {
          // Find channel id
          const channelKey = channels.find((c) => c.id === (c.type === "private" ? `private:${name}` : name))?.id;
          if (!channelKey) return null;
          return (
            <div
              key={channelKey}
              onClick={() => selectChannel(channelKey)}
              className={`p-4 cursor-pointer hover:bg-gray-300 rounded-md ${
                selectedChannel === channelKey ? "bg-gray-300 font-semibold" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{name}</span>
                {unread[channelKey] ? (
                  <span className="w-2 h-2 rounded-full bg-red-500 ml-2" />
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
