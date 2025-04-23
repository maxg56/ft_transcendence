import { GameEngine1v1, GameEngine2v2, GameEngineFFA4 } from './GameEngine';
import { GameMode } from '../type';

export class GameEngineFactory {
  static createEngine(mode: GameMode) {
    switch (mode) {
      case '1v1':
        return new GameEngine1v1(mode);
      case '2v2':
        return new GameEngine2v2(mode);
      case 'ffa4':
        return new GameEngineFFA4(mode);
      default:
        throw new Error(`Unsupported game mode: ${mode}`);
    }
  }
}
