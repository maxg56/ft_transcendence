import UfoFlyby from "@/animation/UfoFly"
import React from "react";

const NotFound: React.FC = () => {

  return (
    <div className=" scale-95">
        <div className="crt w-screen h-screen rounded-[150px] overflow-hidden bg-gray-900 flex flex-col">
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
          </div>
      <div className="absolute top-[10%] left-[35%] text-5xl neonText title">
        <h1>Page non trouvée</h1>
        <UfoFlyby/>
        
      </div>
      <div className="absolute top-[45%] left-[37%] text-7xl neonText title">
      <h1>error 404</h1>
      </div>
    </div>
    </div>
  )};

export default NotFound;