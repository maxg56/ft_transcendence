// components/GameOverlay.tsx
import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import Cookies from 'js-cookie'

type Props = {
  score: [number, number];
  winner?: string | string[] | null;
};

const GameOverlay: React.FC<Props> = ({ score, winner }) => {
  const { t } = useTranslation();
  const myName = Cookies.get('myName') || '';
  const opponent = Cookies.get('opponentName') || '';
  const myAlly = Cookies.get('allyName') || '';
  const opponentAlly = Cookies.get('opponentAlly') || '';

  const getWinner = () => {
    if (!winner) return null;
    const winnerNames = Array.isArray(winner) ? winner.join(" & ") : winner;
    return t("winnerMessage", { side: winnerNames });
  }

  return (
    <div className="title flex flex-col items-center text-center">
      {/* Score affiché tout le temps */}
      <div className="flex flex-row justify-between items-center w-[90vw] max-w-5xl mb-2">
        <span className="text-white text-5xl">{myName} {myAlly && ` - ${myAlly}`}</span>
        <span className="text-white text-7xl">{score[0]} - {score[1]}</span>
        <span className="text-white text-5xl">{opponent} {opponentAlly && ` - ${opponentAlly}`}</span>
      </div>

      {/* Gagnant affiché seulement si défini */}
      {winner && (
        <p className="top-[80px] text-white text-8xl mt-4 neonText">{getWinner()}</p>
      )}
    </div>
  );
};

export default GameOverlay;

