import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TABLE_WIDTH    = 400;
const TABLE_HEIGHT   = 200;
const BALL_RADIUS    = 5;
const WINNING_SCORE  = 3;
const maxSpeed       = 5;
const acceleration   = 1.5; 

function calculateBallRebound(
	ballPos: THREE.Vector3,
	paddlePos: THREE.Vector3,
	direction: THREE.Vector3,
	acceleration: number,
	maxSpeed: number
): THREE.Vector3 {
	const angle = Math.atan2(direction.z, direction.x);
	const offset = ballPos.z - paddlePos.z;
	const spin = offset * 0.05;
  
	let speed = Math.min(direction.length() * acceleration, maxSpeed);
	let newX = Math.cos(angle) * speed;
	let newZ = Math.sin(angle) * speed + spin;
	newZ = Math.sign(newZ) * Math.min(Math.abs(newZ), maxSpeed);
  
	return new THREE.Vector3(
	  direction.x > 0 ? Math.abs(newX) : -Math.abs(newX),
	  0,
	  newZ
	).normalize();
}

export const useBallPhysics4Players = (
	ballRef: React.MutableRefObject<THREE.Mesh | null>,
	leftPaddle1Ref: React.MutableRefObject<THREE.Mesh | null>,
	leftPaddle2Ref: React.MutableRefObject<THREE.Mesh | null>,
	rightPaddle1Ref: React.MutableRefObject<THREE.Mesh | null>,
	rightPaddle2Ref: React.MutableRefObject<THREE.Mesh | null>,
	onScoreUpdate: (score: [number, number]) => void,
	onGameEnd: (winner: string) => void,
	setGameStarted: (gameStarted: boolean) => void,
	gameStarted: boolean
) => {
	const direction = useRef(new THREE.Vector3(1, 0, 1).normalize());
	const speed = useRef(2);
	const score = useRef<[number, number]>([0, 0]);

	const gameStartedRef = useRef(gameStarted);

	useEffect(() => {
		gameStartedRef.current = gameStarted;
	}, [gameStarted]);

	useEffect(() => {
		const updateBall = () => {
			const ball = ballRef.current;
			if (!ball) return;

			ball.position.add(direction.current.clone().multiplyScalar(speed.current));
			
			speed.current += 0.05;

			if (ball.position.x < -TABLE_WIDTH / 2) {
				score.current[1]++;
				onScoreUpdate([...score.current]);
				resetBall(-1);
			} else if (ball.position.x > TABLE_WIDTH / 2) {
				score.current[0]++;
				onScoreUpdate([...score.current]);
				resetBall(1);
			}

			if (score.current[0] >= WINNING_SCORE) {
				onGameEnd('left');
				setGameStarted(false);
				score.current = [0, 0];
			} else if (score.current[1] >= WINNING_SCORE) {
				onGameEnd('right');
				setGameStarted(false);
				score.current = [0, 0];
			}

			checkPaddleCollision(ball);
		};

		const checkPaddleCollision = (ball: THREE.Mesh) => {
			const paddles = [
				leftPaddle1Ref.current,
				leftPaddle2Ref.current,
				rightPaddle1Ref.current,
				rightPaddle2Ref.current,
			].filter((p) => p !== null) as THREE.Mesh[];

			if (paddles.length !== 4) return;

			const ballBox = new THREE.Box3().setFromObject(ball);

			if (
				ball.position.z >= TABLE_HEIGHT / 2 - BALL_RADIUS ||
				ball.position.z <= -TABLE_HEIGHT / 2 + BALL_RADIUS
			) {
				direction.current.z *= -1;
			}

			for (const paddle of paddles) {
				const paddleBox = new THREE.Box3().setFromObject(paddle);
				if (ballBox.intersectsBox(paddleBox)) {
					const rebound = calculateBallRebound(
						ball.position,
						paddle.position,
						direction.current,
						acceleration,
						maxSpeed
					);
					if (paddle.position.x < 0) {
						direction.current.x = Math.abs(rebound.x);
					} else {
						direction.current.x = -Math.abs(rebound.x);
					}
					direction.current.z = rebound.z;
					break;
				}
			}
		};

		const resetBall = (dirX: number) => {
			const ball = ballRef.current;
			if (!ball) return;
			ball.position.set(0, BALL_RADIUS, 0);

			const angleOffset = (Math.random() - 0.5) * 0.4;
			const zDir = Math.sin(angleOffset);
			const xDir = dirX > 0 ? Math.cos(angleOffset) : -Math.cos(angleOffset);

			direction.current.set(xDir, 0, zDir).normalize();
		};

		let animationFrameId: number;

		const animate = () => {
			if (!gameStartedRef.current) {
				animationFrameId = requestAnimationFrame(animate);
				return;
			}
			updateBall();
			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, []);
};
