import { useState } from "react";
import TournamentPopup from "./TournamentPopup";
import { useTranslation } from "@/context/TranslationContext";

export default function VsButton() {
  const [showPopup, setShowPopup] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <button
        className="text-glow px-40 py-2 top-[10%] px-40 py-2  rounded-md text-white font-semibold 
             bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-purple-600/60 
             backdrop-blur-md 
             shadow-[0_0_20px_rgba(0,255,255,0.4)] 
             hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
             border border-cyan-300/30 
             transition duration-300"
        onClick={() => setShowPopup(true)}
      >
        {t("Tournois")}
      </button>
      {showPopup && (
        <TournamentPopup
          onSelect={()=> null}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}