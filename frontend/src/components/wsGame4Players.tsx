import React, { useState, useCallback } from "react";
import { GameCanvas4PlayersWS} from "./game/GameCanvas4Players";
import { useCountdown } from "../hooks/useCountdown";
import { useTranslation } from "../context/TranslationContext";
import { KeyboardProvider } from '../context/KeyboardContext';
import GameOverlay from "./game/GameOverlay";

const Game4PlayersWS: React.FC = () => {
    const [score, setScore] = useState<[number, number]>([0, 0]);
    const [gameStarted, setGameStarted] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
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
			<GameCanvas4PlayersWS
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
    </>
  );
};

export default Game4PlayersWS;
