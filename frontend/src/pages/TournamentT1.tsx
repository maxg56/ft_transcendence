import React, { useState } from 'react';
import useNavigation from "../hooks/useNavigation";

type Player = {
    id: number;
    name: string;
};

type Match = {
    id: number;
    player1?: Player;
    player2?: Player;
    score1?: number;
    score2?: number;
    winner?: Player;
};

const TournamentT1 = () => {
    const [players] = useState<Player[]>([
        { id: 1, name: 'Joueur 1' },
        { id: 2, name: 'Joueur 2' },
        { id: 3, name: 'Joueur 3' },
        { id: 4, name: 'Joueur 4' },
    ]);

    const [matches, setMatches] = useState<Match[]>([
        { id: 1, player1: players[0], player2: players[1] },
        { id: 2, player1: players[2], player2: players[3] },
    ]);
  
    const [resetKey, setResetKey] = useState(0);

    const { navigate } = useNavigation();

    const handleScoreChange = (matchId: number, player: 'player1' | 'player2', value: string) => {
      setMatches(prevMatches =>
          prevMatches.map(match => {
              if (match.id === matchId) {
                  const updatedMatch = { ...match };
                  if (player === 'player1') {
                      updatedMatch.score1 = Number(value);
                  } else {
                      updatedMatch.score2 = Number(value);
                  }
                  if (updatedMatch.score1 !== undefined && updatedMatch.score2 !== undefined) {
                      updatedMatch.winner = updatedMatch.score1 > updatedMatch.score2 ? updatedMatch.player1 : updatedMatch.player2;
                  }
                  return updatedMatch;
              }
              return match;
          })
      );
    };

    const renderMatch = (match: Match) => (
        <div key={match.id} className="flex  mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg w-72 z-10 relative text-lg">

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            className="w-16 border rounded p-2 text-lg"
                            value={match.score1 !== undefined ? match.score1 : ''}
                            onChange={(e) => handleScoreChange(match.id, 'player1', e.target.value)}
                        />
                        <span className="flex-1 truncate">
                            {match.player1?.name || 'À venir'}
                        </span>
                    </div>

                    <div className="h-px bg-gray-200" />

                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            className="w-16 border rounded p-2 text-lg"
                            value={match.score2 !== undefined ? match.score2 : ''}
                            onChange={(e) => handleScoreChange(match.id, 'player2', e.target.value)}
                        />
                        <span className="flex-1 truncate">
                            {match.player2?.name || 'À venir'}
                        </span>
                    </div>
                </div>

                {match.winner && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                        Vainqueur: {match.winner?.name}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div key={resetKey} className="min-h-screen bg-gray-50 p-8">

            <div className="flex justify-center gap-16">
                {/* Colonne Demi-finales */}
                <div className="flex flex-col gap-16">
                    <h2 className="text-lg font-semibold text-center">Matchs à venir</h2>
                    <div className="flex flex-row gap-8">
                        {matches.map(renderMatch)}
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    onClick= {() => navigate("/tournamentStage2")}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TournamentT1;
