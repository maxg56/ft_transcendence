import { useEffect } from 'react';
import * as THREE from 'three';
import { useWebSocket } from '../context/WebSocketContext'; // à adapter selon ton projet

export const useBallFromServer = (
	ballRef: React.MutableRefObject<THREE.Mesh | null>,
	leftPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
	rightPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
	onScoreUpdate: (score: [number, number]) => void,
	onGameEnd: (winner: string) => void,
	setGameStarted: (started: boolean) => void
) => {
	const socket  = useWebSocket();

	useEffect(() => {
		const handleGameState = (data: any) => {
			const { ball, paddles, score, winner } = data.payload;

			// Position de la balle
			if (ballRef.current) {
				ballRef.current.position.x = ball.x;
				ballRef.current.position.z = ball.z;
			}

			// Position des raquettes
			if (leftPaddleRef.current) {
				leftPaddleRef.current.position.z = paddles.left.z;
			}
			if (rightPaddleRef.current) {
				rightPaddleRef.current.position.z = paddles.right.z;
			}

			// Mise à jour du score
			onScoreUpdate(score);

			// Fin de partie
			if (winner) {
				onGameEnd(winner);
				setGameStarted(false);
			}
		};

		const onMessage = (event: MessageEvent) => {
			try {
				const message = JSON.parse(event.data);
				if (message.type === 'game-state') {
					handleGameState(message);
				}
			} catch (err) {
				console.error('Erreur de parsing WebSocket:', err);
			}
		};

		socket.addEventListener('message', onMessage);

		return () => {
			socket.removeEventListener('message', onMessage);
		};
	}, [socket]);
};
