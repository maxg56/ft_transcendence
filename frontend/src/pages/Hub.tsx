import React from "react";
import useNavigation from "../hooks/useNavigation";
import { useTranslation } from "../context/TranslationContext";
import { useProfileContext } from "../context/ProfilContext";
import SettingsModal from "../components/SettingsModal";

const Hub: React.FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const { profileImage } = useProfileContext();

  return (
    <div>
      <header className="bg-orange-300 p-8 text-white flex justify-between items-center relative">
        {/* Texte centré */}
        <h1 className="text-center flex-1">Bienvenue sur Hub</h1>
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
      <button className=""
        onClick={() => navigate("/duel")}>
        {t('Duel')}
      </button>
    </div>
  );
};

export default Hub;

