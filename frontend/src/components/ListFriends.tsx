import React, { useState, useEffect } from "react";
import { useApi } from "@/hooks/api/useApi";
import { FriendStatusResponse, FriendWithStatus } from "./profil/type/profilInterface";
import { useTranslation } from "@/context/TranslationContext";

const FriendListHub: React.FC = () => {
  const { t } = useTranslation();

  const [friendStatus, setFriendStatus] = useState<FriendWithStatus[]>([]);

  const { refetch: fetchFriendList } = useApi<FriendStatusResponse>(
    "/user/friend/status",
    {
      immediate: false,
      onSuccess: (data) => {
        if (data) {
          setFriendStatus(data.friends);
        } else {
          console.error("Erreur friends list", data);
        }
      },
      onError: (errMsg) => {
        console.error("Erreur friendList : ", errMsg);
      },
    }
  );
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchFriendList()
      setTimeout(() => {
        fetchData();
      }, 5000);
    };
  
    fetchData();
  }, []);
  
  return (
		<div className="w-64 h-[500px] p-2 shadow-lg rounded-lg mt-4 rounded-xl p-4 
        bg-gradient-to-br from-cyan-400/10 via-blue-500/10
        backdrop-blur-md border border-cyan-300/20 
        shadow-[0_0_15px_rgba(0,255,255,0.2)] 
        text-white w-[350px] h-[400px] overflow-hidden">

        <div className="max-h-[500px] overflow-y-auto pr-1 text-xs space-y-4">

          <div>
            <h4 className="font-semibold text-green-400 mb-1">{t("En ligne")}</h4>
            <ul className="space-y-2">
              {friendStatus
                .filter(friend => friend.online)
                .map((friend, index) => (
                  <li key={`online-${index}`} className="flex items-center gap-2 p-2 rounded-lg 
                    bg-gradient-to-r from-green-200/30 via-green-100/30 to-green-200/30 
                    backdrop-blur-sm border border-white/20 shadow-inner text-sm">
                    <img
                      src={friend.avatar || `https://robohash.org/${friend.username}`}
                      alt={friend.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" title="En ligne" />
                      <span className="truncate max-w-[150px]">{friend.username}</span>
                    </div>
                  </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-red-400 mb-1">{t("Hors ligne")}</h4>
            <ul className="space-y-2">
              {friendStatus
                .filter(friend => !friend.online)
                .map((friend, index) => (
                  <li key={`offline-${index}`} className="flex items-center gap-2 p-2 rounded-lg 
                    bg-gradient-to-r from-red-200/20 via-red-100/20 to-red-200/20 
                    backdrop-blur-sm border border-white/20 shadow-inner text-sm">
                    <img
                      src={friend.avatar || `https://robohash.org/${friend.username}`}
                      alt={friend.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" title="Hors ligne" />
                      <span className="truncate max-w-[150px]">{friend.username}</span>
                    </div>
                  </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
	);
};

export default FriendListHub;
