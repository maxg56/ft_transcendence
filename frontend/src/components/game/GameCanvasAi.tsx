
import { useGameScene } from '../../hooks/game/Scene/useGameScene';
import { useAiInputControl } from '../../hooks/useAiInputControl';
import { useBallPhysics } from '../../hooks/game/Ball/useBallPhysics';

type GameCanvasProps = {
	gameStarted: boolean;
	setScore: (score: [number, number]) => void;
	setWinner: (winner: string | null) => void;
	setGameStarted: (gameStarted :boolean) => void;

};

export const GameCanvasAI = ({
	gameStarted,
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
	useAiInputControl(leftPaddleRef, rightPaddleRef, ballRef, true);
	useBallPhysics(
		ballRef,
		leftPaddleRef,
		rightPaddleRef,
		setScore,
		setWinner,
		setGameStarted,
		gameStarted);

	return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default GameCanvasAI;