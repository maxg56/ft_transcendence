import React from "react";
import useNavigation from "../hooks/useNavigation";
import { useTranslation } from "../context/TranslationContext";
import Header from "../components/HeaderComponent";
import { App } from "../animation/hub_animation";

const Hub: React.FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  return (
     <div>
      <div className="w-screen h-screen rounded-container flex justify-center items-center">
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
  );
};

export default Hub; 
