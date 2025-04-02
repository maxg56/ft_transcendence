import React from "react";
import { useTranslation } from "../context/TranslationContext";
import Header from "../components/HeaderComponent";
import DuelComponent from "../components/DuelComponent";

const Duel: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Header/>
      <div className="flex justify-center items-center w-full h-[839px] overflow-hidden">
        <DuelComponent />
      </div>

	  </div>
  )};

export default Duel;