import React, { useState, useCallback } from "react";
import {GameCanvas4Players} from "./game/GameCanvas4Players";
import { useCountdown } from "../hooks/useCountdown";
import { useTranslation } from "../context/TranslationContext";
import useNavigation from "../hooks/useNavigation";
import { KeyboardProvider } from '../context/KeyboardContext';
import GameOverlay from "./game/GameOverlay";

const DuelComponent: React.FC = () => {

  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  

  const handleCountdownDone = useCallback(() => {
    setGameStarted(true);
	}, []);
  const [countdownKey, setCountdownKey] = useState(0);
const countdown = useCountdown(3, handleCountdownDone, countdownKey);

const resetGame = () => {
  setScore([0, 0]);
  setWinner(null);
  setGameStarted(false);
  setCountdownKey(prev => prev + 1); 
};

  return (
    <>
      <div className="absolute top-[5%] left-1/2 transform -translate-x-1/2 text-black text-2xl">
        {winner ? (
          <div className="flex flex-col items-center text-white ">
            <div className="absolute top-[250%] text-5xl neonText">
            <h2>{winner} {t("gagne !")}</h2>
            </div>
            <div>
              <button
                className=" neon-button bg-blue-500 mt-2 px-20 py-7 rounded text-black hover:bg-gray-300 inline-block mr-4"
                onClick={resetGame}
              >
                {t("Revanche")}
              </button>
              <button
                className="neon-button bg-blue-500 mt-2 px-20 py-7 rounded text-black hover:bg-gray-300 inline-block"
                onClick={() => navigate("/hub")}
              >
                {t("Retour au menu")}
              </button>
            </div>
          </div>
        ) : (
           <GameOverlay
            score={score}
            winner={winner}
            />
        )}
      </div>
        
      {countdown != -1 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl">
          <h2>{countdown === 0 ? 'GO !' : `${countdown}...`}</h2>
        </div>
      )}

      <KeyboardProvider>
			  <GameCanvas4Players
          // gameStarted={gameStarted}
          setScore={setScore}
          setWinner={setWinner}
          setGameStarted={setGameStarted}
         />
		  </KeyboardProvider>
      
    </>
  );
};

export default DuelComponent;
