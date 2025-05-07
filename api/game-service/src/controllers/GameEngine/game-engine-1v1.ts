import { GameScore1v1,PlayerSide1v1 } from '../../type';
import { TABLE_WIDTH, BALL_RADIUS, PADDLE_HEIGHT, WINNING_SCORE, MOVE_SPEED, TABLE_HEIGHT } from './constants';
import {BaseGameEngine} from './BaseGameEngine';

class GameEngine1v1 extends BaseGameEngine<PlayerSide1v1, GameScore1v1>{

    score = { left: 0, right: 0 };

    paddles = { left: { z: 0  }, right: { z: 0 } };

    checkCollisions(): void {
        if (this.ball.x <= -TABLE_WIDTH / 2 + BALL_RADIUS) {
            if (Math.abs(this.ball.z - this.paddles.left.z) < PADDLE_HEIGHT / 1.2) {
            this.direction = this.calculateRebound('left');
        }
    }

    if (this.ball.x >= TABLE_WIDTH / 2 - BALL_RADIUS) {
      if (Math.abs(this.ball.z - this.paddles.right.z) < PADDLE_HEIGHT / 1.2) {
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

  movePaddle(side: PlayerSide1v1, direction: 'up' | 'down') {
	  const delta = direction === 'up' ? -MOVE_SPEED : MOVE_SPEED;
	  const nextZ = this.paddles[side].z + delta;
	  const limit = (TABLE_HEIGHT / 2) - (PADDLE_HEIGHT / 1.4);
	  this.paddles[side].z = Math.max(-limit, Math.min(limit, nextZ));
	}
}

export  { GameEngine1v1 };