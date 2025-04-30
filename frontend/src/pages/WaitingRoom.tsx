import React from "react";
import { useWaitroomListener } from "@/hooks/WedSooket/useWaitroomListener";

const Waitroom: React.FC = () => {
  useWaitroomListener();

  return (
    <div className="scale-95">
      <div>
        <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
          </div>
          <div className="flex justify-center items-center w-full h-[839px] overflow-hidden text-white">
            <h1>hey waitroom page</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitroom;
