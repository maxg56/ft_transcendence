import React, { useEffect } from 'react';
import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/context/TranslationContext';

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
    <div className="min-h-screen bg-gray-800 p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Classement Final</h1>
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
                {entry.wins} victoire{entry.wins > 1 ? 's' : ''}
              </span>
            </li>
          ))
        ) : (
          <li key="no-ranking" className="text-center text-gray-400">Aucun classement disponible</li>
        )}
      </ol>
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          📋 Résultats des matchs
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
            <li key="no-matches" className="text-center text-gray-400">Aucun résultat</li>
          )}
        </ul>
      </div>
      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate("/hub")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        >
          {t("Return Hub")}
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <span className="text-gray-400 text-sm">Redirection automatique dans 10 secondes...</span>
      </div>
    </div>
  );
};

export default Results;
