import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import NextMatch from '@/components/Tournament/NextMatch';
import React, { useState} from 'react';
import { useTranslation } from "@/context/TranslationContext";
import StarsBackground from "@/animation/StarsBackground";

import { toast } from 'sonner';

const TournamentT2: React.FC = () => {
  const { lastResults, matches, isHost, sendTournamentNextStep } = useWaitroomListener();
  const [loadingNextStep, setLoadingNextStep] = useState(false);

  // Handler pour le bouton host
  const handleNextStep = async () => {
    try {
      setLoadingNextStep(true);
      await sendTournamentNextStep();
      toast.success('Prochaine étape demandée au serveur.');
    } catch (e) {
      toast.error('Erreur lors de la demande de prochaine étape.');
    } finally {
      setLoadingNextStep(false);
    }
  };

  console.log("lastResults" , isHost);
  
  const finishedMatches = lastResults
  const upcomingMatches = matches
  const { t } = useTranslation();
  // Affichage d'un match (résultat ou à venir)
  const renderMatch = (m: any, showResult = false) => (
    <NextMatch matchData={m} currentUser={""} showResult={showResult} />
  );

  return (
    <div className="scale-95">
    <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 ">
      <StarsBackground/>
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
      </div>
      {isHost && (
        <div className="flex justify-center mb-6">
          <button
            className="title rounded text-glow px-6 py-2 text-white font-semibold 
             bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-purple-600/60 
             backdrop-blur-md 
             shadow-[0_0_20px_rgba(0,255,255,0.4)] 
             hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
             border border-cyan-300/30 
             transition duration-300"
            onClick={handleNextStep}
            disabled={loadingNextStep}
          >
            {loadingNextStep ? t("Envoi...") : t("Lancer la prochaine étape")}
          </button>
        </div>
      )}
      <div className={`space-y-16 `}>
        <section>
          <h2 className="text-center font-semibold mb-4 text-white title text-5xl">{t("Derniers matchs joués")}</h2>
          <div className="flex justify-center gap-8 flex-wrap ">
            {finishedMatches.length > 0 ? (
  finishedMatches.map((m: any, idx: number) => (
    // Prefer a unique match identifier for the key; fallback to idx if not available
    <React.Fragment key={m.match ? `finished-${m.match}` : `finished-idx-${idx}`}>
      {renderMatch(m, true)}
    </React.Fragment>
  ))
) : (
  <span className="text-gray-400">{t("Aucun match terminé")}</span>
)}
          </div>
        </section>

        <section>
          <h2 className="text-center font-semibold mb-4 text-white title text-5xl">{t("Prochains matchs à venir")}</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {upcomingMatches.length > 0 ? (
  upcomingMatches.map((m: any, idx: number) => (
    // Prefer a unique match identifier for the key; fallback to idx if not available
    <React.Fragment key={m.match ? `upcoming-${m.match}` : `upcoming-idx-${idx}`}>
      {renderMatch(m, false)}
    </React.Fragment>
  ))
) : (
  <span className="text-gray-400">{t("Aucun match à venir")}</span>
)}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default TournamentT2;


