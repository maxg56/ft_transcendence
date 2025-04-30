import { useEffect } from 'react';
import * as THREE from 'three';
import { useWebSocket } from '@/context/WebSocketContext';

export const useBallFromServer = (
	ballRef: React.MutableRefObject<THREE.Mesh | null>,
	leftPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
	rightPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
	onScoreUpdate: (score: [number, number]) => void,
	onGameEnd: (winner: string) => void,
	setGameStarted: (started: boolean) => void
) => {
	const socket = useWebSocket();
	
	
	

	useEffect(() => {
		const handleGameState = (data: any) => {
			const { ball, paddles, score, winner } = data.state;

			if (ballRef.current) {
				ballRef.current.position.x = ball.x;
				ballRef.current.position.z = ball.z;
			}

			if (leftPaddleRef.current) {
				leftPaddleRef.current.position.z = paddles.left.z;
			}

			if (rightPaddleRef.current) {
				rightPaddleRef.current.position.z = paddles.right.z;
			}

			onScoreUpdate(score);

			if (winner) {
				onGameEnd(winner);
				setGameStarted(false);
			}
		};

		const onMessage = (event: MessageEvent) => {
			try {
				const message = JSON.parse(event.data);
				if (message.event === 'game_state' && message.state) {
					handleGameState(message);
				} else {
					console.warn('Message WebSocket inattendu:', message);
				}
			} catch (err) {
				console.error('Erreur de parsing WebSocket:', err);
			}
		};

		if (!socket) {
			console.error('WebSocket non initialisé');
			return;
		}
		socket.addEventListener('message', onMessage);

		return () => {
			socket.removeEventListener('message', onMessage);
		};
	}, [socket]);
};
