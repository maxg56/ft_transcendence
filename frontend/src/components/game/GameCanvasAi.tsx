import { useEffect, useState } from 'react';
import { useGameScene } from '../../hooks/useGameScene';
import { useInputControls } from '../../hooks/useInputControls';
import { useBallPhysics } from '../../hooks/useBallPhysics';
import { useAIPaddle } from '../../hooks/useAiPaddle'; // <--  AI hook

type GameCanvasProps = {
	gameStarted: boolean;
	isPaused: boolean;
	setScore: (score: [number, number]) => void;
	setWinner: (winner: string | null) => void;
	setGameStarted: (gameStarted :boolean) => void;

};

export const GameCanvasAI = ({
	gameStarted,
	isPaused,
	setScore,
	setWinner,
	setGameStarted
}: GameCanvasProps) => {
	const {
		mountRef,
		leftPaddleRef,
		rightPaddleRef,
		ballRef,
	} = useGameScene();
	useAIPaddle(leftPaddleRef, ballRef, true); // Enable AI control
	useInputControls(leftPaddleRef, rightPaddleRef);
	useBallPhysics(ballRef, leftPaddleRef, rightPaddleRef, setScore, setWinner,setGameStarted, isPaused , gameStarted);

	return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default GameCanvasAI;