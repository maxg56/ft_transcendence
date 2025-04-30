import { useEffect } from 'react';
import * as THREE from 'three';
import { useNavigate } from "react-router-dom";
import { useWebSocket } from '@/context/WebSocketContext';
import Cookies from "js-cookie";

export const useBallFromServer = (
	ballRef: React.MutableRefObject<THREE.Mesh | null>,
	leftPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
	rightPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
	onScoreUpdate: (score: [number, number]) => void,
	onGameEnd: (winner: string) => void,
	setGameStarted: (started: boolean) => void
) => {
	const socket = useWebSocket();
	const navigate = useNavigate();

	useEffect(() => {
		const handleGameState = (data: any) => {
			const { ball, paddles, score } = data.state;
			const teamId = Cookies.get("teamId");
			const isTeam1 = teamId === '1';

			if (ballRef.current) {
				ballRef.current.position.x = isTeam1 ? ball.x : -ball.x;
				ballRef.current.position.z = ball.z;
			}

			if (leftPaddleRef.current && rightPaddleRef.current) {
				leftPaddleRef.current.position.z = isTeam1 ? paddles.left.z : paddles.right.z;
				rightPaddleRef.current.position.z = isTeam1 ? paddles.right.z : paddles.left.z;
			}

			const updatedScore: [number, number] = isTeam1
				? [score.left, score.right]
				: [score.right, score.left];

			onScoreUpdate(updatedScore);
		};

		const onMessage = (event: MessageEvent) => {
			try {
				const message = JSON.parse(event.data);
				if (message.event === 'game_state' && message.state) {
					handleGameState(message);
				} else if (message.event === 'game_result') {
					const teamId = Cookies.get("teamId");
					const isTeam1 = teamId === '1';
					const winner = isTeam1 ? message.winner : message.winner === 'left' ? 'right' : 'left';
					onGameEnd(winner);
					setGameStarted(false);
					navigate('/hub');
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
