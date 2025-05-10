import { activeGames } from '../config/data';
import { startGameLoop } from './gameLoop';
import {logError,logformat} from '../utils/log';

export function startAutoMatchGameTimer(gameId: string) {
    const game = activeGames.get(gameId);
    if (!game) return;
    // Lancer un timer de 5 secondes
    const autoStartTimer = setTimeout(() => {
      const stillGame = activeGames.get(gameId);
      if (stillGame) {
        stillGame.engine.time = new Date();
        startGameLoop(gameId);
        logformat(`Partie ${gameId} démarrée automatiquement après 5 secondes.`);
        stillGame.players.forEach((p) => {
          p.ws.send(JSON.stringify({ event: 'game_started_auto' }));
        });
      }
    }, 5000);
  
    game.autoStartTimer = autoStartTimer;
}
  