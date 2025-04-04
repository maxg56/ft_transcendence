import React from "react";
import useNavigation from "../hooks/useNavigation";
import { useTranslation } from "../context/TranslationContext";
import Header from "../components/HeaderComponent";

const Hub: React.FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  return (
    <div>
      <Header/>
      <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
        onClick={() =>
         navigate("/duel")}>
        {t('Duel')}
      </button>
      <button className="px-4 py-2 bg-orange-300 text-black rounded hover:bg-gray-200"
              onClick ={ () => navigate("/multiplayerselect")}>
        {t("Multijoueur")}
      </button>
    </div>
  );
};

export default Hub;

