import React from "react";

interface Match {
  match: string;
  player1: string;
  player2: string;
  score: {
    player1: number;
    player2: number;
  };
}

interface NextMatchProps {
  matchData: Match;
  currentUser: string;
  showResult: boolean;
}

const NextMatch: React.FC<NextMatchProps> = ({ matchData, currentUser, showResult }) => {
  const { match, player1, player2, score } = matchData;
  const hasScore = showResult && (score.player1 !== 0 || score.player2 !== 0);

  let winner: string | null = null;
  if (hasScore) {
    if (score.player1 > score.player2) {
      winner = player1;
    } else if (score.player2 > score.player1) {
      winner = player2;
    }
  }

  return (
    <div className="border rounded-2xl shadow-md p-6 bg-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Next Match: {match}</h2>
      <p className="text-center text-gray-600 mb-4">You are: <span className="font-semibold">{currentUser}</span></p>

      <div className="flex justify-between items-center text-lg font-medium">
        <span className={winner === player1 ? "text-green-600 font-bold" : ""}>
          {player1}
        </span>
        <span>{score.player1} - {score.player2}</span>
        <span className={winner === player2 ? "text-green-600 font-bold" : ""}>
          {player2}
        </span>
      </div>

      {hasScore && winner && (
        <div className="mt-4 text-center text-green-700 font-semibold">
          Winner: {winner}
        </div>
      )}
    </div>
  );
};

export default NextMatch;
