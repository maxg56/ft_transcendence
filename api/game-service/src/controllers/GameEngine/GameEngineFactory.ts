
import { GameEngine1v1 } from './game-engine-1v1';
import { GameEngine2v2 } from './game-engine-2v2';
import { GameMode } from '../../type';

export class GameEngineFactory {
  static createEngine(mode: GameMode) {
    switch (mode) {
      case '1v1':
        return new GameEngine1v1(mode);
      case '2v2':
        return new GameEngine2v2(mode);
      default:
        throw new Error(`Unsupported game mode: ${mode}`);
    }
  }
}
