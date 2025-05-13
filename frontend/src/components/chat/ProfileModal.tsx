import React from 'react';
import { useChatWebSocket } from '@/context/ChatWebSocketContext';
import { X } from 'lucide-react';
import { useTranslation } from "@/context/TranslationContext";

const ProfileModal: React.FC = () => {
  const { t } = useTranslation();
  const { profile, clearProfile } = useChatWebSocket();
  if (!profile) return null;
  return (
      <div className="rounded-lg shadow-lg flex flex-col overflow-hidden bg-gradient-to-br from-cyan-400/10 via-blue-500/10 backdrop-blur-md border border-cyan-300/20 shadow-[0_0_15px_rgba(0,255,255,0.2)] text-black relative p-4">
        <button onClick={clearProfile} className="absolute top-2 right-2 text-white hover:text-gray-800">
          <X size={20} />
        </button>
        <h2 className="text-center text-lg text-white font-semibold p-2 border-b mb-4">{t("Profil")}</h2>
        <div className="flex flex-col items-center space-y-4">
          {profile.avatar ?(
            <img
              src={profile.avatar}
              alt={profile.username}
              className="w-24 h-24 rounded-full object-cover"
            /> 
          ) : (
            <img
								src={`https://robohash.org/${profile.username}`}
								alt={profile.username}
								className="w-24 h-24 rounded-full object-cover"
							/>
          )}
          <h3 className="text-lg font-semibold text-white">{profile.username}</h3>
          <p className="text-sm text-white">Elo: {profile.elo}</p>
        </div>
      </div>
  );
};

export default ProfileModal;
