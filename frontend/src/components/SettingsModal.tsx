import { X, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "../context/TranslationContext";


const SettingsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangOptions, setShowLangOptions] = useState(false);
  const { t, changeLanguage } = useTranslation();

  useEffect(() => {
    if (isOpen) setShowLangOptions(false);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
      >
        <Settings size={32} />
      </button>

      {isOpen && (
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
              <X size={24} />
            </button>

            <h2 className="text-lg text-black font-bold mb-4">{t("Paramètres")}</h2>

            {!showLangOptions ? (
              <button className="px-4 py-2 bg-blue-300 text-black rounded hover:bg-gray-200 w-full mb-4" 
                      onClick={() => setShowLangOptions(true)}>
                {t("Choisir langue")}
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button className="px-4 py-2 bg-blue-300 text-black rounded hover:bg-gray-200 w-full"
                        onClick={() => changeLanguage("en")}>
                  English
                </button>
                <button className="px-4 py-2 bg-blue-300 text-black rounded hover:bg-gray-200 w-full"
                        onClick={() => changeLanguage("fr")}>
                  Français
                </button>
                <button className="px-4 py-2 bg-blue-300 text-black rounded hover:bg-gray-200 w-full"
                        onClick={() => changeLanguage("pt")}>
                  Portugais
                </button>
                <button className="px-4 py-2 bg-blue-300 text-black rounded hover:bg-gray-200 w-full"

                        onClick={() => changeLanguage("kgt")}>
                  Klingon
                </button>
              </div>
            )}            
          </div>
         </div>
      )}
    </>
  );
};

export default SettingsModal;