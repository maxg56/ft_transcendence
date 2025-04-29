	import { useEffect, useRef } from 'react';
	import * as THREE from 'three';

	const TABLE_WIDTH = 400;
	const TABLE_HEIGHT = 200;
	const BALL_RADIUS = 5;
	const WINNING_SCORE = 3;
	const maxSpeed = 5;
	const accelerationSpeed = 1.5;

	type Vector = { x: number; z: number };

	function calculateBallRebound(
	ballPos: THREE.Vector3,
	paddlePos: THREE.Vector3,
	direction: Vector,
	acceleration: number,
	maxSpeed: number
	): Vector {
	const angleOfApproach = Math.atan2(direction.z, direction.x);
	const impactOffset = ballPos.z - paddlePos.z;
	const spin = impactOffset * 0.05;

	let newX = Math.abs(direction.x) * acceleration;
	newX = Math.min(newX, maxSpeed);

	let newZ = Math.sin(angleOfApproach) * Math.abs(newX) + spin;
	newZ = Math.min(Math.abs(newZ), maxSpeed) * Math.sign(newZ);

	return { x: newX, z: newZ };
	}


	export const useBallPhysics = (
		ballRef: React.MutableRefObject<THREE.Mesh | null>,
		leftPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
		rightPaddleRef: React.MutableRefObject<THREE.Mesh | null>,
		onScoreUpdate: (score: [number, number]) => void,
		onGameEnd: (winner: string) => void,
		setGameStarted: (gameStarted: boolean) => void,
		isPaused: boolean,
		gameStarted: boolean
	) => {
		const direction = useRef(new THREE.Vector3(1, 0, 1).normalize());
		const speed = useRef(2);
		const score = useRef<[number, number]>([0, 0]);

		const isPausedRef = useRef(isPaused);
		const gameStartedRef = useRef(gameStarted);

		useEffect(() => {
			isPausedRef.current = isPaused;
			gameStartedRef.current = gameStarted;
		}, [isPaused, gameStarted]);

		useEffect(() => {
			const updateBall = () => {
				const ball = ballRef.current;
				if (!ball) return;

				ball.position.add(direction.current.clone().multiplyScalar(speed.current));
				
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
				const left = leftPaddleRef.current;
				const right = rightPaddleRef.current;
				if (!left || !right) return;

				const ballBox = new THREE.Box3().setFromObject(ball);
				const leftBox = new THREE.Box3().setFromObject(left);
				const rightBox = new THREE.Box3().setFromObject(right);
				if (
					ball.position.z >= TABLE_HEIGHT / 2 - BALL_RADIUS ||
					ball.position.z <= -TABLE_HEIGHT / 2 + BALL_RADIUS
				){
					direction.current.z *= -1;
				}
				if (ballBox.intersectsBox(leftBox)) {
					const rebound = calculateBallRebound(
						ball.position,
						left.position,
						direction.current,
						accelerationSpeed,
						maxSpeed
					);
					direction.current.x = Math.abs(rebound.x);
					direction.current.z = rebound.z;
				}
				if (ballBox.intersectsBox(rightBox)) {
					const rebound = calculateBallRebound(
						ball.position,
						right.position,
						direction.current,
						accelerationSpeed,
						maxSpeed
					);
					direction.current.x = -Math.abs(rebound.x);
					direction.current.z = rebound.z;
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
				if (!gameStartedRef.current || isPausedRef.current) {
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
