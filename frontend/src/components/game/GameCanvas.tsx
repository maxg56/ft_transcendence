import { useGameScene } from '../../hooks/useGameScene';
import { useInputControls, usePlayerControls } from '../../hooks/useInputControls';
import { useBallPhysics } from '../../hooks/useBallPhysics';
import { useBallFromServer } from '../../hooks/useBallFromServer';
import Cookies from "js-cookie";

type GameCanvasProps = {
	gameStarted?: boolean;
	isPaused?: boolean;
	setScore: (score: [number, number]) => void;
	setWinner: (winner: string | null) => void;
	setGameStarted: (gameStarted: boolean) => void;
};

export const GameCanvas = ({
	gameStarted,
	isPaused,
	setScore,
	setWinner,
	setGameStarted,
}: GameCanvasProps) => {
	const {
		mountRef,
		leftPaddleRef,
		rightPaddleRef,
		ballRef,
	} = useGameScene();

	useInputControls(leftPaddleRef, rightPaddleRef);
	useBallPhysics(
		ballRef,
		leftPaddleRef,
		rightPaddleRef,
		setScore,
		setWinner,
		setGameStarted,
		isPaused,
		gameStarted
	);

	return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export const GameCanvasWs = ({
	setScore,
	setWinner,
	setGameStarted,
}: GameCanvasProps) => {
	const {
		mountRef,
		leftPaddleRef,
		rightPaddleRef,
		ballRef,
	} = useGameScene();

	var gameId = Cookies.get("gameId");
	if (gameId) {
		usePlayerControls('left', gameId);	
	}
	useBallFromServer(
		ballRef,
		leftPaddleRef,
		rightPaddleRef,
		setScore,
		setWinner,
		setGameStarted
	);

	return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};
