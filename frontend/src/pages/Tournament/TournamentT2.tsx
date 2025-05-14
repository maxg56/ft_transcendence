import React, { useEffect } from 'react';
import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import { useNavigate } from 'react-router-dom';
import NextMatch from '@/components/Tournament/NextMatch';
import {StarsBackground} from '@/animation/StarsBackground'
import { useTranslation } from '@/context/TranslationContext';

const TournamentT2: React.FC = () => {
  const { lastResults, matches } = useWaitroomListener();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirection automatique si tous les matchs sont terminés
  useEffect(() => {
    if (Array.isArray(matches) && matches.length > 0 && matches.every((m: any) => m.status === 'finished')) {
      const timeout = setTimeout(() => {
        navigate('/tournament/results');
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [matches, navigate]);

  // Affichage d'un match (résultat ou à venir)
  const renderMatch = (m: any, showResult = false) => (
    <NextMatch matchData={m} currentUser={""} showResult={showResult} />
  );

  return (
    <div className="scale-95">
    <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 text-white ">
    <StarsBackground/>
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
    </div>
      <div className="space-y-16">
        <section>
          <h2 className="text-center font-semibold mb-4 title text-glow">{t("Derniers matchs joués")}</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {Array.isArray(lastResults) && lastResults.length > 0 ? (
              lastResults.map((m: any) => renderMatch(m, true))
            ) : (
              <span className="text-gray-400">{t("Aucun match terminé")}</span>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-center font-semibold mb-4 title text-glow">{t("Prochains matchs à venir")}</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            {Array.isArray(matches) && matches.length > 0 ? (
              matches.map((m: any) => renderMatch(m, false))
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
