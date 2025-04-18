type Vector = { x: number; z: number };
type Position = { x: number; z: number };
type PlayerSide = 'left' | 'right';

const TABLE_WIDTH = 400;
const TABLE_HEIGHT = 200;
const BALL_RADIUS = 5;
const PADDLE_HEIGHT = 40;
const WINNING_SCORE = 3;
const MAX_SPEED = 5;
const ACCELERATION = 1.5;

export class GameEngine {
	private ball: Position = { x: 0, z: 0 };
	private direction: Vector = { x: 1, z: 1 };
	private speed = 2;
	private score: [number, number] = [0, 0];
	private paddles = {
		left: { z: 0 },
		right: { z: 0 },
	};
	private winner: PlayerSide | null = null;

	constructor() {
		this.resetBall(1);
	}

	update(): void {
		if (this.winner) return;

		this.moveBall();
		this.checkCollisions();
		this.checkScore();
	}

	private moveBall(): void {
		this.ball.x += this.direction.x * this.speed;
		this.ball.z += this.direction.z * this.speed;

		if (this.ball.z >= TABLE_HEIGHT / 2 - BALL_RADIUS || this.ball.z <= -TABLE_HEIGHT / 2 + BALL_RADIUS) {
			this.direction.z *= -1;
		}
	}

	private checkCollisions(): void {
		// Collision avec le paddle gauche
		if (this.ball.x <= -TABLE_WIDTH / 2 + BALL_RADIUS) {
			const paddle = this.paddles.left;
			if (Math.abs(this.ball.z - paddle.z) < PADDLE_HEIGHT / 2) {
				this.direction = this.calculateRebound('left');
			}
		}

		// Collision avec le paddle droit
		if (this.ball.x >= TABLE_WIDTH / 2 - BALL_RADIUS) {
			const paddle = this.paddles.right;
			if (Math.abs(this.ball.z - paddle.z) < PADDLE_HEIGHT / 2) {
				this.direction = this.calculateRebound('right');
			}
		}
	}

	private checkScore(): void {
		if (this.ball.x < -TABLE_WIDTH / 2) {
			this.score[1]++;
			if (this.score[1] >= WINNING_SCORE) this.winner = 'right';
			else this.resetBall(1);
		}
		if (this.ball.x > TABLE_WIDTH / 2) {
			this.score[0]++;
			if (this.score[0] >= WINNING_SCORE) this.winner = 'left';
			else this.resetBall(-1);
		}
	}

	private calculateRebound(side: PlayerSide): Vector {
		const paddle = this.paddles[side];
		const impactOffset = this.ball.z - paddle.z;
		const spin = impactOffset * 0.05;

		let newX = ACCELERATION * Math.abs(this.direction.x);
		newX = Math.min(newX, MAX_SPEED);

		let newZ = Math.sin(Math.atan2(this.direction.z, this.direction.x)) * newX + spin;
		newZ = Math.min(Math.abs(newZ), MAX_SPEED) * Math.sign(newZ);

		return {
			x: side === 'left' ? Math.abs(newX) : -Math.abs(newX),
			z: newZ,
		};
	}

	private resetBall(dirX: number): void {
		this.ball = { x: 0, z: 0 };
		const angle = (Math.random() - 0.5) * 0.4;
		const z = Math.sin(angle);
		const x = dirX > 0 ? Math.cos(angle) : -Math.cos(angle);
		this.direction = { x, z };
		this.speed = 2;
	}

	movePaddle(side: PlayerSide, direction: 'up' | 'down') {
		const delta = direction === 'up' ? -5 : 5;
		const nextZ = this.paddles[side].z + delta;
		const limit = TABLE_HEIGHT / 2 - PADDLE_HEIGHT / 2;
		this.paddles[side].z = Math.max(-limit, Math.min(limit, nextZ));
	}

	getGameState() {
		return {
			ball: this.ball,
			paddles: this.paddles,
			score: this.score,
			winner: this.winner,
		};
	}
}
