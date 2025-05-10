import React, { useState, useCallback } from "react";
import GameCanvas from "../game/GameCanvasAi";
import { useCountdown } from "@/hooks/useCountdown";
import { useTranslation } from "@/context/TranslationContext";
import useNavigation from "@/hooks/useNavigation";
import { KeyboardProvider } from '@/context/KeyboardContext';
import GameOverlay from "../game/GameOverlay";

export const SoloComponent: React.FC = () => {

  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const handleCountdownDone = useCallback(() => {
    setGameStarted(true);
	}, []);
  const [countdownKey] = useState(0);
const countdown = useCountdown(3, handleCountdownDone, countdownKey);

  return (
    <>
      {countdown != -1 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl">
          <h2>{countdown === 0 ? 'GO !' : `${countdown}...`}</h2>
        </div>
      )}
      <KeyboardProvider>
			  <GameCanvas
          gameStarted={gameStarted}
          setScore={setScore}
          setWinner={setWinner}
          setGameStarted={setGameStarted}
         />
		  </KeyboardProvider>
      <div className="absolute top-[5%] left-1/2 transform -translate-x-1/2 text-black text-2xl">
        <GameOverlay
          score={score}
          winner={winner}
        />
        </div>
        {winner && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <button
            className="neon-button bg-blue-500 px-20 py-7 rounded text-black hover:bg-gray-300"
            onClick={() => navigate("/hub")}
          >
            {t("Retour au menu")}
          </button>
        </div>
      )}
    </>
  );
};

export default SoloComponent;