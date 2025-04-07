import React from "react";
import useNavigation from "../hooks/useNavigation";
import { useTranslation } from "../context/TranslationContext";
import Header from "../components/HeaderComponent";
import { App } from "../animation/hub_animation";
import { Scene } from "../animation/bouton_header";
import SettingsModal from "../components/SettingsModal";

const Hub: React.FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  return (

      <div className=" scale-95 ">
     <div>
      {/* <Header/> */}
      {/* <Scene/> */}
      <div className="w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
      {/* Rectangle titre  (w-1/3 (33.33%) to w-2/5 (40%) ) */}
      <div className="w-3/5 mx-auto mt-4 py-3 px-6 bg-gray-800 rounded-[20px] border-2 border-gray-600 shadow-lg text-white text-xl font-bold text-center">
        Ft_transcendence
      </div>
      {/* <div className="w-screen h-screen rounded-container flex justify-center items-center"> */}
       {/* <Header/> */}
      {/* <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
        onClick={() =>
         navigate("/duel")}>
        {t('Duel')}
      </button>
      <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200">
        {t("Multijoueur")}
      </button>
      <div className="flex justify-center items-center mt-8"> */}
     <App />
      </div>
     </div>
     </div>
  );
};

export default Hub; 
