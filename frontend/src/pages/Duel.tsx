import React from "react";
import { useTranslation } from "../context/TranslationContext";
import Header from "../components/HeaderComponent";
import DuelComponent from "../components/DuelComponent";

const Duel: React.FC = () => {
  const { t } = useTranslation();

  return (
      <div className=" scale-95">
     <div>
      <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
      {/* CRT Scanline Sweep */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="w-full h-full absolute top-[-100%] scanline-glow" />
      </div>
      <div className="flex justify-center items-center w-full h-[839px] overflow-hidden">
        <DuelComponent />
      </div>
      </div>
      </div>
	    </div>
  )};

export default Duel;