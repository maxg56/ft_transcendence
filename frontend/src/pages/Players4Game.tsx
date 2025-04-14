import React from "react";
import { useTranslation } from "../context/TranslationContext";
import Header from "../components/HeaderComponent";
import Game4Players from "../components/Game4Players";

const PlayersGame4: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Header/>
      <div className="flex justify-center items-center w-full h-[839px] overflow-hidden">
        <Game4Players />
      
      </div>

	  </div>
  )};

export default PlayersGame4;