import React, { useState, useCallback } from "react";
import {GameCanvasWs} from "./game/GameCanvas";
import { useCountdown } from "../hooks/useCountdown";
import { useTranslation } from "../context/TranslationContext";
import { KeyboardProvider } from '../context/KeyboardContext';
import GameOverlay from "./game/GameOverlay";
import useNavigation from "@/hooks/useNavigation";
import Cookies from "js-cookie"

const DuelComponent: React.FC = () => {

  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const handleCountdownDone = useCallback(() => {
    setGameStarted(true);
	}, []);
  const [countdownKey] = useState(0);
  const countdown = useCountdown(3, handleCountdownDone, countdownKey);

  const handleReturn = () => {
    ['allyName',
      'gameid',
      'myName',
      'opponentName',
      'opponentAlly',
      'positionInTeam',
      'teamId'].forEach(n => Cookies.remove(n));
      navigate("/hub");
  }

  return (
    <>
      {countdown != -1 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl">
          <h2>{countdown === 0 ? 'GO !' : `${countdown}...`}</h2>
        </div>
      )}
      <KeyboardProvider>
			  <GameCanvasWs
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
            onClick={() => handleReturn()}
          >
            {t("Retour au menu")}
          </button>
        </div>
      )}
    </>
  );
};

export default DuelComponent;
