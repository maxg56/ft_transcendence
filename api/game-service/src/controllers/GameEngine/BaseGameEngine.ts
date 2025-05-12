
import { PlayerSide, Position, Vector, GameMode,GameScore,GameScore1v1,GameScore2v2,PlayerSide1v1,PlayerSide2v2,TeamScore } from '../../type';
import { TABLE_WIDTH, TABLE_HEIGHT, BALL_RADIUS, PADDLE_HEIGHT, WINNING_SCORE, MAX_SPEED, ACCELERATION, MOVE_SPEED} from './constants';



abstract class BaseGameEngine<
  TSide extends string = PlayerSide,
  TScore = Record<TSide, number>
>{
	protected ball: Position = { x: 0, z: 0 };
	protected direction: Vector = { x: 1, z: 1 };
	protected speed = 2;
	time = new Date();
	winner: TSide | null = null;
	abstract score: TScore;
	abstract paddles: Record<TSide, { z: number }>;
  
	constructor(protected mode: GameMode) {
	  this.resetBall(-1);
	}
  
	update(): void {
	  if (this.isGameOver()) return;
	  this.moveBall();
	  this.checkCollisions();
	  this.checkScore();
	}
  
	protected moveBall(): void {
	  this.ball.x += this.direction.x * this.speed;
	  this.ball.z += this.direction.z * this.speed;
  
	  if (
		this.ball.z >= TABLE_HEIGHT / 2 - BALL_RADIUS ||
		this.ball.z <= -TABLE_HEIGHT / 2 + BALL_RADIUS
	  ) {
		this.direction.z *= -1;
	  }
	}
  
	protected resetBall(dirX: number): void {
	  this.ball = { x: 0, z: 0 };
	  const angle = (Math.random() - 0.5) * 0.4;
	  const z = Math.sin(angle);
	  const x = dirX > 0 ? Math.cos(angle) : -Math.cos(angle);
	  this.direction = { x, z };
	  this.speed = 2;
	}
  
	movePaddle(side: TSide, direction: 'up' | 'down') {
	  const delta = direction === 'up' ? -MOVE_SPEED : MOVE_SPEED;
	  const nextZ = this.paddles[side].z + delta;
	  const limit = TABLE_HEIGHT / 2 - PADDLE_HEIGHT / 2;
	  this.paddles[side].z = Math.max(-limit, Math.min(limit, nextZ));
	}
	
	protected calculateRebound(side: TSide): Vector {
		const paddle = this.paddles[side];
		const impactOffset = this.ball.z - paddle.z;
		const spin = impactOffset * 0.05;
		
		let newX = ACCELERATION * Math.abs(this.direction.x);
		newX = Math.min(newX, MAX_SPEED);
		
		let newZ = Math.sin(Math.atan2(this.direction.z, this.direction.x)) * newX + spin;
		newZ = Math.min(Math.abs(newZ), MAX_SPEED) * Math.sign(newZ);
		
	  const directionX = side === 'left' || side === 'left2' ? Math.abs(newX) : -Math.abs(newX);
	  
	  return { x: directionX, z: newZ };
	}
	movePlayer(playerId: TSide, direction: 'up' | 'down') {
		if (this.paddles[playerId]) {
			this.movePaddle(playerId, direction);
		}
	}
	
	abstract checkCollisions(): void;
	abstract checkScore(): void;
	
	getGameState() {
	  return {
		ball: this.ball,
		paddles: this.paddles,
		score: this.score,
		winner: this.winner,
	  };
	}
	isGameOver(): boolean {
	  return this.winner !== null;
	}
  }
  





class GameEngineFFA4 extends BaseGameEngine<PlayerSide2v2, GameScore> {
  score = { left: 0, right: 0, left2: 0, right2: 0 };
  paddles = {
    left: { z: -60 },
    left2: { z: 60 },
    right: { z: -60 },
    right2: { z: 60 },
  };

  checkCollisions(): void {
    for (const side of Object.keys(this.paddles) as PlayerSide[]) {
      const isLeft = side === 'left' || side === 'left2';
      const borderX = isLeft ? -TABLE_WIDTH / 2 + BALL_RADIUS : TABLE_WIDTH / 2 - BALL_RADIUS;
      const conditionX = isLeft ? this.ball.x <= borderX : this.ball.x >= borderX;

      if (conditionX && Math.abs(this.ball.z - this.paddles[side].z) < PADDLE_HEIGHT / 2) {
        this.direction = this.calculateRebound(side);
        break;
      }
    }
  }

  checkScore(): void {
    if (this.ball.x < -TABLE_WIDTH / 2) {
		const missedSide = Math.abs(this.ball.z - this.paddles.left.z) < Math.abs(this.ball.z - this.paddles.left2.z) ? 'left' : 'left2';
		this.score[missedSide]++;
		this.resetBall(1);
	  }
	  
	  if (this.ball.x > TABLE_WIDTH / 2) {
		const missedSide = Math.abs(this.ball.z - this.paddles.right.z) < Math.abs(this.ball.z - this.paddles.right2.z) ? 'right' : 'right2';
		this.score[missedSide]++;
		this.resetBall(-1);
	  }
  }
}

export { BaseGameEngine, GameEngineFFA4 };
