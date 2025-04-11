import calculateElo from './calculateElo';
import Match from "../models/Match";
import MatchPlayer from "../models/MatchPlayer";
import User from "../models/User";
import { Player } from "../models/Player";
import { logformat, logError } from "./log";



async function handleGameResult( activeGames: Map<string, Player[]> , data: any, player: Player) {
  const game = activeGames.get(data.gameId);
  if (game) {
    const updatedPlayers =calculateElo(game, data.winner);
    logformat("game result",data.gameId,"winner:" ,data.winner,)
    for (const player of updatedPlayers) {
      await User.update({ elo: player.elo }, { where: { id: player.id } });
    }
    const match = await Match.create({
      is_pong_game: data.isPongGame,
      playedAt: new Date(),
      durationSeconds: data.durationSeconds,
    });
    for (const player of game) {
      await MatchPlayer.create({
        matchId: match.id,
        playerId: player.id,
        score: player.id === data.winner ? data.winnerScore : data.loserScore,
      });
      player.ws.send(JSON.stringify({ event: 'game_result', data: { winner: data.winner, score: player.id === data.winner ? data.winnerScore : data.loserScore } }));
    }
    activeGames.delete(data.gameId);
  }
  else
  {
    logError("Game not found", data.gameCode);
    player.ws.send(JSON.stringify({ event: "error", message: "Game not found" }));
  }
}

export default handleGameResult;