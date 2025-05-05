import React from "react";

import DuelComponent from "@/components/wsduel";
import StarsBackground from "@/animation/StarsBackground";

const Duel3: React.FC = () => {
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

export default Duel3;