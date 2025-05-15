import React, { useEffect, useState } from 'react';
import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/context/TranslationContext';

const Results: React.FC = () => {
  const { ranking, isHost, code} = useWaitroomListener();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setWaiting(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [isHost, code, ranking]);

  // Redirection automatique vers la page principale après 10 secondes
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/hub');
    }, 10000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-800 p-8 text-white">
      <div className={waiting ? 'opacity-50 pointer-events-none select-none' : ''}>
        <h1 className="text-3xl font-bold mb-6 text-center">🏆 Classement Final</h1>
        <ol className="max-w-md mx-auto space-y-4">
          {Array.isArray(ranking) && ranking.length > 0 ? (
            ranking.map((entry: any, idx: number) => (
              <li
                key={entry.name || entry.player || idx}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow"
              >
                <span className="text-lg font-semibold">{entry.name || entry.player}</span>
              </li>
            ))
          ) : (
            <li key="no-ranking" className="text-center text-gray-400">Aucun classement disponible</li>
          )}
        </ol>
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/hub")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            disabled={waiting}
          >
            {t("Return Hub")}
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <span className="text-gray-400 text-sm">Redirection automatique dans 10 secondes...</span>
        </div>
      </div>
    </div>
  );
};

export default Results;
