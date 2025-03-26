import React, { useState, useEffect } from "react";
import useNavigation from "../hooks/useNavigation";
import { X, LogOut, Settings } from "lucide-react";
import { useTranslation } from "../context/TranslationContext";
import { useProfileContext } from "../context/ProfilContext";

const Hub: React.FC = () => {
  const { navigate } = useNavigation();
  const [isParamOpen, setParamOpen] = useState(false);
  const [showLangOptions, setShowLangOptions] = useState(false);
  const { t, changeLanguage } = useTranslation();

  useEffect(() => {
    if (isParamOpen) {
        setShowLangOptions(false);
    }
  }, [isParamOpen]);

  const { profileImage } = useProfileContext();

  return (
    <div>
      <header className="bg-orange-300 p-4 text-white flex justify-center items-center relative">
        <h1>Bienvenue sur Hub</h1>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex gap-[50px]">
          <button 
            className="text-white hover:text-gray-200"
            onClick={() => navigate("/")}>
              <LogOut size={32}/>
          </button>
          <button
              className="text-white hover:text-gray-200"
              onClick={() => setParamOpen(true)}>
                  <Settings size={32} />
          </button>
        </div>

        {/* Acces au profil par l'image de profil */}
        <div className="absolute top-1/2 left-4">
          <img
            src={profileImage || "/default-profile.png"}
            alt="Profile"
            className="w-12 h-12 rounded-full cursor-pointer border border-gray-300"
            onClick={() => navigate("/profile")}
          >

          </img>
        </div>
      </header>






























      {isParamOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                        <button
                        onClick={() => setParamOpen(false)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
                            <X size={24} />
                        </button>
                        <h2 className="text-lg font-bold mb-4">{t('Parametres')} </h2>
                        {!showLangOptions ? (
                            <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200" 
                            onClick={() => setShowLangOptions(true) }>
                            {t('Choisir langue')}</button>

                        ): (
                        <div className="flex flex-col gap-2">
                            <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                                onClick={() => changeLanguage("en") }>
                                    English
                            </button>
                            <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
                                onClick={() => changeLanguage("fr")}>
                                    Français
                            </button>
                        </div>
                )}
                    </div>
                </div>
            )}

    </div>
  );
};

export default Hub;
