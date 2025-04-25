import React from "react";
import { useTranslation } from "../context/TranslationContext";
import DuelComponent from "../components/2DuelComponent";
import StarsBackground from "../animation/StarsBackground";

const Duel2: React.FC = () => {
  const { t } = useTranslation();

  return (
      <div className=" scale-95">
     <div>
      <div className="w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
      <div className="flex justify-center items-center w-full h-[839px] overflow-hidden">
        <StarsBackground />
        <DuelComponent />
      </div>
      </div>
      </div>
	    </div>
  )};

export default Duel2;