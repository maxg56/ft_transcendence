import React from "react";
import { useTranslation } from "@/context/TranslationContext";

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
  const { t } = useTranslation();

  let winner: string | null = null;
  if (hasScore) {
    if (score.player1 > score.player2) {
      winner = player1;
    } else if (score.player2 > score.player1) {
      winner = player2;
    }
  }

  return (
    <div className="border rounded-2xl p-7 max-w-md mx-auto rounded-md text-white font-semibold 
                        bg-gradient-to-r from-cyan-400/50 via-blue-500/30 to-purple-600/40 
                        backdrop-blur-md
                        shadow-[0_0_20px_rgba(0,255,255,0.4)] 
                        border border-cyan-300/30 
                        transition duration-300">
      <h2 className="text-3xl font-bold mb-4 text-center">{t("Next Match")}: {match}</h2>
      <p className="text-center text-gray-400 mb-4"><span className="font-semibold">{currentUser}</span></p>

      <div className="flex justify-between items-center text-2xl font-medium">
        <span className={winner === player1 ? "text-green-600 font-bold" : ""}>
          {player1}
        </span>
        <span>{score.player1} - {score.player2}</span>
        <span className={winner === player2 ? "text-green-600 font-bold" : ""}>
          {player2}
        </span>
      </div>

      {hasScore && winner && (
        <div className="mt-4 text-center text-green-600 font-semibold">
          {t("Winner")}: {winner}
        </div>
      )}
    </div>
  );
};

export default NextMatch;
