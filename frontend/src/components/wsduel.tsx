import React, { useState, useCallback } from "react";
import GameCanvas from "./game/GameCanvas";
import ControlsModal from "./ControlsOverlay";
import { useCountdown } from "../hooks/useCountdown";
import { useTranslation } from "../context/TranslationContext";
import useNavigation from "../hooks/useNavigation";
import { KeyboardProvider } from '../context/KeyboardContext';
import GameOverlay from "./game/GameOverlay";

const DuelComponent: React.FC = () => {

  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

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
      <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 text-black text-2xl">
        {winner ? (
          <div className="flex flex-col items-center">
            <h2>{winner} a gagné !</h2>
            <div>
              <button
                className="mt-2 px-3 py-1 rounded bg-gray-300 text-black hover:bg-gray-200 inline-block mr-4"
                onClick={resetGame}
              >
                Restart
              </button>
              <button
                className="mt-2 px-3 py-1 rounded bg-gray-300 text-black hover:bg-gray-200 inline-block"
                onClick={() => navigate("/hub")}
              >
                Retour au menu
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-4xl">
          <h2>{countdown === 0 ? 'GO !' : `Lancement dans ${countdown}...`}</h2>
        </div>
      )}

      <button
        className="absolute center-left[20%] right-4 z-50 bg-white/80 text-black font-semibold px-4 py-2 rounded-lg shadow"
        onClick={openModal}
      >
        {t("Controls")}
      </button>
      <ControlsModal isOpen={isModalOpen} onClose={closeModal} />

      <KeyboardProvider>
			  <GameCanvas
          gameStarted={gameStarted}
          setScore={setScore}
          setWinner={setWinner}
          setGameStarted={setGameStarted}
         />
		  </KeyboardProvider>
      
    </>
  );
};

export default DuelComponent;
