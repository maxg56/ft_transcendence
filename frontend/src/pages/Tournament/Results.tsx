import React, { useEffect } from 'react';
import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/context/TranslationContext';
import {StarsBackground} from '@/animation/StarsBackground'

const Results: React.FC = () => {
  const { ranking, matches } = useWaitroomListener();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirection automatique vers la page principale après 10 secondes
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/hub');
    }, 10000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="scale-95">
      <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 text-white ">
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
      </div>
      <StarsBackground/>
      <h1 className="text-6xl font-bold mb-6 text-center text-glow title">{t("🏆 Classement Final")}</h1>
      <ol className="max-w-md mx-auto space-y-4">
        {Array.isArray(ranking) && ranking.length > 0 ? (
          ranking.map((entry: any, idx: number) => (
            <li
              key={entry.name || entry.player || idx}
              className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow"
            >
              <span className="text-xl font-semibold">
                {idx + 1}. {entry.name || entry.player}
              </span>
              <span className="text-lg text-green-300">
                {entry.wins} t{("victoire")}{entry.wins > 1 ? 's' : ''}
              </span>
            </li>
          ))
        ) : (
          <li key="no-ranking" className="text-center text-gray-400">{t("Aucun classement disponible")}</li>
        )}
      </ol>
      <div>
        <h2 className="text-xl font-semibold text-white mb-4 absolute left-10">
          {t("📋 Résultats des matchs")}
        </h2>
        <ul className="space-y-2">
          {Array.isArray(matches) && matches.length > 0 ? (
            matches.map((m: any) => (
              <li
                key={m.id}
                className="p-4 bg-gray-700 rounded shadow text-white"
              >
                {m.player1?.name || m.player1} ({m.score1}) vs {m.player2?.name || m.player2} ({m.score2}) →{' '}
                <strong className="text-green-300">{m.winner?.name || m.winner}</strong>
              </li>
            ))
          ) : (
            <li key="no-matches" className="text-center text-gray-400">{t("Aucun résultat")}</li>
          )}
        </ul>
      </div>
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/hub")}
          className="bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-purple-600/60 
             backdrop-blur-md 
             shadow-[0_0_20px_rgba(0,255,255,0.4)] 
             hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
             border border-cyan-300/30 
             transition duration-300 z-10 text-white font-bold py-2 px-6 rounded"
        >
          {t("Return Hub")}
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <span className="text-gray-400 text-sm">{t("Redirection automatique dans 10 secondes...")}</span>
      </div>
    </div>
    </div>
  );
};

export default Results;
