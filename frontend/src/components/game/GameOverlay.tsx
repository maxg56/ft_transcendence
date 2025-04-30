// components/GameOverlay.tsx
import React from 'react';

type Props = {
  score: [number, number];
  winner: string | null;
};

const GameOverlay: React.FC<Props> = ({ score, winner }) => {
  return (
    <div className="text-white text-7xl">
      <p>{score[0]} - {score[1]}</p>
      {winner && <p>Winner: Player {winner}</p>}
    </div>
  );
};

export default GameOverlay;

