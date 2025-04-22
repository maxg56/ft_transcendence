import handleGameResult,{GameResultData} from './game_result';
import { activeGames } from '../config/data';

export async function startGameLoop(gameId: string) {
    const game = activeGames.get(gameId);
    if (!game) return;
  
    const interval = setInterval(() => {
      game.engine.update();
      const state = game.engine.getGameState();
  
      game.players.forEach((p) => {
        p.ws.send(JSON.stringify({ event: 'game_state', state }));
      });
  
      if (state.winner) {
        clearInterval(interval);
        const result: GameResultData = {
          gameId,
          winner: state.winner,
          isPongGame: true,
          isPrivateGame: false,
          durationSeconds: Number(Math.floor((Date.now() - game.engine.time.getTime()) / 1000)),
          score: state.score,
        };
         
        handleGameResult(result);
        
      }
    }, 1000 / 60); // 60 FPS
  }