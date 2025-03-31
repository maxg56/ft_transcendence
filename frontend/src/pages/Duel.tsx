import React from "react";
import useNavigation from "../hooks/useNavigation";
import { useTranslation } from "../context/TranslationContext";
import { useProfileContext } from "../context/ProfilContext";
import SettingsModal from "../components/SettingsModal";
import DuelComponent from "../components/DuelComponent";

const Duel: React.FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const { profileImage } = useProfileContext();

  return (
    <div>
      <header className="bg-orange-300 p-6 text-white flex justify-between items-center relative">
        {/* Texte centré */}
        <h1 className="text-center flex-1">Bienvenue sur Duel</h1>
          <SettingsModal />
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <img
            src={profileImage || "/default-profile.png"}
            alt="Profile"
            className="w-12 h-12 rounded-full cursor-pointer border border-gray-300"
            onClick={() => navigate("/profile")}
          />
        </div>
      </header>
      <div className="flex justify-center items-center w-full h-[839px] overflow-hidden">
        <DuelComponent />
      </div>

	  </div>
  )};

export default Duel;