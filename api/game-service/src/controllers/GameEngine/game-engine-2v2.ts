import { PlayerSide2v2,TeamScore } from '../../type';
import { TABLE_WIDTH, BALL_RADIUS, PADDLE_HEIGHT, WINNING_SCORE } from './constants';
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
        Math.abs(this.ball.z - this.paddles.left.z) < PADDLE_HEIGHT / 2 ||
        Math.abs(this.ball.z - this.paddles.left2.z) < PADDLE_HEIGHT / 2
      ) {
        this.direction = this.calculateRebound('left');
      }
    }

    if (this.ball.x >= TABLE_WIDTH / 2 - BALL_RADIUS) {
      if (
        Math.abs(this.ball.z - this.paddles.right.z) < PADDLE_HEIGHT / 2 ||
        Math.abs(this.ball.z - this.paddles.right2.z) < PADDLE_HEIGHT / 2
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
}


export { GameEngine2v2 };