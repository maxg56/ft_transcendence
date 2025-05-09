// components/GameOverlay.tsx
import React from 'react';
import { useTranslation } from '@/context/TranslationContext';

type Props = {
  score: [number, number];
  winner?: string | string[] | null;
};

const GameOverlay: React.FC<Props> = ({ score, winner }) => {
  const { t } = useTranslation();

  const getWinner = () => {
    if (!winner) return null;
    const winnerNames = Array.isArray(winner) ? winner.join(" & ") : winner;
    return t("winnerMessage", { side: winnerNames });
  }

  return (
    <div className="flex flex-col items-center text-center">
      {/* Score affiché tout le temps */}
      <p className="text-white text-7xl">{score[0]} - {score[1]}</p>

      {/* Gagnant affiché seulement si défini */}
      {winner && (
        <p className="text-white text-7xl mt-4">{getWinner()}</p>
      )}
    </div>
  );
};

export default GameOverlay;

