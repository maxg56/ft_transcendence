import { useGameScene } from '@/hooks/game/Scene/useGameScene';
import { useInputControls, usePlayerControls } from '@/hooks/game/Controls/useInputControls';
import { useBallPhysics } from '@/hooks/game/Ball/useBallPhysics';
import { useBallFromServer } from '@/hooks/game/Ball/useBallFromServer';
import Cookies from "js-cookie";

type GameCanvasProps = {
	gameStarted: boolean;
	setScore: (score: [number, number]) => void;
	setWinner: (winner: string | null) => void;
	setGameStarted: (gameStarted: boolean) => void;
};

type GameCanvasPropsWs = {
	gameStarted?: boolean;
	setScore: (score: [number, number]) => void;
	setWinner: (winner: string | null) => void;
	setGameStarted: (gameStarted: boolean) => void;
};

export const GameCanvas = ({
	gameStarted,
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
			gameStarted
		);
	return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export const GameCanvasWs = ({
	setScore,
	setWinner,
	setGameStarted,
}: GameCanvasPropsWs) => {
	const {
		mountRef,
		leftPaddleRef,
		rightPaddleRef,
		ballRef,
	} = useGameScene();

	const gameId = Cookies.get("gameid");
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
