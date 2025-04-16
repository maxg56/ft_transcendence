import { useState } from 'react';

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
  nextMatchId?: number;
};

const TournamentBracket = () => {
  const [players] = useState<Player[]>([
    { id: 1, name: 'Joueur 1' },
    { id: 2, name: 'Joueur 2' },
    { id: 3, name: 'Joueur 3' },
    { id: 4, name: 'Joueur 4' },
  ]);

  const [matches, setMatches] = useState<Match[]>([
    // Demi-finales
    { id: 1, player1: players[0], player2: players[1], nextMatchId: 3 },
    { id: 2, player1: players[2], player2: players[3], nextMatchId: 3 },
    // Petite finale
    { id: 4, nextMatchId: 5 }, 
    // Finale
    { id: 3, nextMatchId: 5 },
    // Champion
    { id: 5 }
  ]);

  const handleScoreChange = (matchId: number, player: 'player1' | 'player2', value: string) => {
    setMatches(prev => prev.map(match => {
      if (match.id !== matchId) return match;
      
      const newScore = { ...match };
      if (player === 'player1') {
        newScore.score1 = Number(value);
      } else {
        newScore.score2 = Number(value);
      }

      if (newScore.score1 && newScore.score2) {
        newScore.winner = newScore.score1 > newScore.score2 ? newScore.player1 : newScore.player2;
        propagateWinner(matchId, newScore.winner);
      }

      return newScore;
    }));
  };

  const propagateWinner = (matchId: number, winner?: Player) => {
    const currentMatch = matches.find(m => m.id === matchId);
    if (!currentMatch?.nextMatchId || !winner) return;

    setMatches(prev => prev.map(m => {
      if (m.id === currentMatch.nextMatchId) {
        if (!m.player1) return { ...m, player1: winner };
        if (!m.player2) return { ...m, player2: winner };
      }
      return m;
    }));
  };

  const getMatchConnections = (matchId: number) => {
    return matches.filter(m => m.nextMatchId === matchId);
  };

  const renderMatch = (match: Match) => (
    <div key={match.id} className="flex  mb-8">
      <div className="bg-white p-6 rounded-lg shadow-lg w-72 z-10 relative text-lg">

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-16 border rounded p-2 text-lg"
              value={match.score1 || ''}
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
              value={match.score2 || ''}
              onChange={(e) => handleScoreChange(match.id, 'player2', e.target.value)}
            />
            <span className="flex-1 truncate">
              {match.player2?.name || 'À venir'}
            </span>
          </div>
        </div>

        {match.winner && (
          <div className="mt-2 text-xs text-green-600 font-medium">
            Vainqueur: {match.winner.name}
          </div>
        )}
      </div>

      {/* Lignes de connexion */}
      {getMatchConnections(match.id).length > 0 && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          {getMatchConnections(match.id).map((_, i) => (
            <div key={i} className="absolute h-8 w-0.5 bg-gray-400" 
                 style={{ left: `${i * 50 - 25}px` }} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      <div className="flex justify-center gap-16">
        {/* Colonne Demi-finales */}
        <div className="flex flex-col gap-16">
          <h2 className="text-lg font-semibold text-center">Matchs a venir</h2>
          <div className="flex flex-row gap-8">
            {matches.slice(0, 2).map(renderMatch)}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TournamentBracket;
