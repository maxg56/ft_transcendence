import React from 'react';
import { useTournament } from '../context/ResultsContext';

const Results: React.FC = () => {
  const { results } = useTournament();

  const participants = Array.from(
    new Set(
      results.flatMap(m => [m.player1?.name, m.player2?.name].filter(Boolean))
    )
  ) as string[];

  const winCount: Record<string, number> = {};
  participants.forEach(name => { winCount[name] = 0; });
  results.forEach(m => {
    if (m.winner?.name) {
      winCount[m.winner.name] += 1;
    }
  });

  const ranking = participants
    .map(name => ({ name, wins: winCount[name] }))
    .sort((a, b) => b.wins - a.wins);

  return (
    <div className="min-h-screen bg-gray-800 p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Classement Final</h1>

      <ol className="max-w-md mx-auto space-y-4">
        {ranking.map((entry, idx) => (
          <li
            key={entry.name}
            className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow"
          >
            <span className="text-xl font-semibold">
              {idx + 1}. {entry.name}
            </span>
            <span className="text-lg text-green-300">
              {entry.wins} victoire{entry.wins > 1 ? 's' : ''}
            </span>
          </li>
        ))}
      </ol>
	  <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          📋 Résultats des matchs
        </h2>
        <ul className="space-y-2">
          {results.map(m => (
            <li
              key={m.id}
              className="p-4 bg-gray-700 rounded shadow text-white"
            >
              {m.player1?.name} ({m.score1}) vs {m.player2?.name} ({m.score2}) →{' '}
              <strong className="text-green-300">{m.winner?.name}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Results;
