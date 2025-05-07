import { PlayerSide2v2,TeamScore } from '../../type';
import { TABLE_WIDTH, BALL_RADIUS, PADDLE_HEIGHT, WINNING_SCORE, MOVE_SPEED, TABLE_HEIGHT } from './constants';
import {BaseGameEngine} from './BaseGameEngine';


class GameEngine2v2 extends BaseGameEngine<PlayerSide2v2, TeamScore> {
  score = { left: 0, right: 0 };
  paddles = {
    left: { z: -50 },
    left2: { z: 50 },
    right: { z: -50 },
    right2: { z: 50 },
  };

  checkCollisions(): void {
    if (this.ball.x <= -TABLE_WIDTH / 2 + BALL_RADIUS) {
      if (
        Math.abs(this.ball.z - this.paddles.left.z) < PADDLE_HEIGHT / 1.1 ||
        Math.abs(this.ball.z - this.paddles.left2.z) < PADDLE_HEIGHT / 1.1
      ) {
        this.direction = this.calculateRebound('left');
      }
    }

    if (this.ball.x >= TABLE_WIDTH / 2 - BALL_RADIUS) {
      if (
        Math.abs(this.ball.z - this.paddles.right.z) < PADDLE_HEIGHT / 1.1 ||
        Math.abs(this.ball.z - this.paddles.right2.z) < PADDLE_HEIGHT / 1.1
      ) {
        this.direction = this.calculateRebound('right');
      }
    }
  }

  checkScore(): void {
    if (this.ball.x < -TABLE_WIDTH / 2) {
      this.score.right++;
      if (this.score.right >= WINNING_SCORE) this.winner = 'right';
      else this.resetBall(1);
    }
    if (this.ball.x > TABLE_WIDTH / 2) {
      this.score.left++;
      if (this.score.left >= WINNING_SCORE) this.winner = 'left';
      else this.resetBall(-1);
    }
  }

  movePaddle(side: PlayerSide2v2, direction: 'up' | 'down') {
	  const delta = direction === 'up' ? -MOVE_SPEED : MOVE_SPEED;
	  const nextZ = this.paddles[side].z + delta;
	  const limit = (TABLE_HEIGHT / 2) - (PADDLE_HEIGHT / 1.4);
    const clampedZ = Math.max(-limit, Math.min(limit, nextZ));
    
    const teammateMap: Record<PlayerSide2v2, PlayerSide2v2> = {
      left: 'left2',
      left2: 'left',
      right: 'right2',
      right2: 'right',
    };

    const teammateSide = teammateMap[side];
    const teammateZ = this.paddles[teammateSide].z;
    // peut etre changer le 1.3 en 1.4
    if (Math.abs(clampedZ - teammateZ) < (PADDLE_HEIGHT * 1.3)) {
        return
    }
	  this.paddles[side].z = clampedZ;
	}
}


export { GameEngine2v2 };