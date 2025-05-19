import React, { useEffect } from 'react';
import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/context/TranslationContext';
import {StarsBackground} from '@/animation/StarsBackground'

const Results: React.FC = () => {
  const { ranking } = useWaitroomListener();
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
      <div className='title text-glow py-3 rounded-md text-white font-semibold 
             bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-purple-600/60 
             backdrop-blur-md 
             shadow-[0_0_20px_rgba(0,255,255,0.4)] 
             hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
             border border-cyan-300/30 
             transition duration-300 z-10'>
      <h1 className="text-6xl font-bold mb-6 text-center text-glow title">{t("🏆 Classement Final")}</h1>
      </div>
      <ol className="absolute top-[20%] left-[44%] text-5xl text-center text-glow">
        {Array.isArray(ranking) && ranking.length > 0 ? (
          ranking.map((entry: any, idx: number) => (
            <li
              key={entry.name || entry.player || idx}
              className="items-center bg-gray-700 text-xl p-5 h-20 w-60 rounded-lg shadow "
            >
              <span className="text-xl font-semibold">
                {idx + 1}. {entry.name || entry.player}
              </span>
            </li>
          ))
        ) : (
          <li key="no-ranking" className="text-gray-400 absolute left-[30%]">{t("Aucun classement disponible")}</li>
        )}
      </ol>
      <div className="flex justify-center mt-12 absolute top-[60%] left-[44%]">
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
      <div className="flex justify-center mt-4 absolute top-[72%] left-[44%]">
        <span className="text-gray-400 text-sm">{t("Redirection automatique dans 10 secondes...")}</span>
      </div>
    </div>
    </div>
  );
};

export default Results;