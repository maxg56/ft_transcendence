import React from "react";
import { useWaitroomListener } from "@/hooks/WedSooket/useWaitroomListener";
import { useTranslation } from '@/context/TranslationContext';

const Waitroom: React.FC = () => {
  useWaitroomListener();
  const { t } = useTranslation();

  return (
    <div className="scale-95 relative">

      <div className="relative z-10">
        <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
          </div>
          <div className="flex justify-center items-center w-full h-[839px] overflow-hidden">
            <video
              className="absolute top-0 left-0 w-screen h-screen object-cover z-0 scale-125"
                src="/videos/black_hole.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
          </div>
          <div className="title text-glow px-40 py-2 px-40 py-2 rounded-md text-white font-semibold 
             bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-yellow-600/60 
             backdrop-blur-md 
             shadow-[0_0_20px_rgba(0,255,255,0.4)] 
             hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
             border border-cyan-300/30 
             transition duration-300 z-10">
          <h1>{t("waiting room")}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitroom;
