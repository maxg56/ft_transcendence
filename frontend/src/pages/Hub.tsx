import React from "react";
import Header from "../components/HeaderComponent";
import { App } from "../animation/hub_animation";
import { useMode } from "../components/ModeContext";

const Hub: React.FC = () => {
  const { mode } = useMode();

  const getStartText = () => {
    if (mode) {
      return (
        <>
          Start !<br />{mode} mode
        </>
      );
    }
    return "Start !";
  };

  return (
    <div className="scale-95">
      <div>
        <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
          <Header />
          {/* CRT Scanline Sweep */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
          </div>
          <div className="flex justify-center items-center w-full h-[839px] overflow-hidden">
            <App />
            <button
              className="absolute center neon-button px-20 py-10 bg-blue-300 text-black rounded hover:bg-gray-50"
              onClick={() => void(true)}
            >
              {getStartText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hub;
