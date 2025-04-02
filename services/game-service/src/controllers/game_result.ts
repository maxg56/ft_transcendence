import calculateElo from './calculateElo';
import Match from "../models/Match";
import MatchPlayer from "../models/MatchPlayer";
import User from "../models/User";
import { Player } from "../models/Player";
import activeGames from "../services";

const game = activeGames.get(data.gameId);
      if (game) {
    
        const updatedPlayers =calculateElo(game, data.winner);
        
        if (data.winner === player1.id) {
          player1.elo = newEloWinner;
          player2.elo = newEloLoser;
        } else {
          player2.elo = newEloWinner;
          player1.elo = newEloLoser;
        }
        activeGames.delete(data.gameId);
      }
      break;

async function handleGameResult( activeGames: Map<string, Player[]> , data: any, player: Player) {
  const game = activeGames.get(data.gameId);
  if (game) {
    const winner = game.find((p) => p.id === data.winner);
    const loser = game.find((p) => p.id !== data.winner);
    const updatedPlayers = calculateElo(game, data.winner);
    const match = await Match.create({ winnerId: winner.id, loserId: loser.id });
    await MatchPlayer.bulkCreate(updatedPlayers.map((p) => ({ matchId: match.id, userId: p.id, elo: p.rating })));
    activeGames.delete(data.gameId);
  }
}

export default handleGameResult;