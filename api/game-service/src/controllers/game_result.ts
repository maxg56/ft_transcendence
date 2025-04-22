import calculateElo from './calculateElo';
import Match from "../models/Match";
import MatchPlayer from "../models/MatchPlayer";
import User from "../models/User";
import { Player } from "../models/Player";
import { logformat, logError } from "./log";
import { GameEngine } from './GameEngine';
import { activeGames } from '../config/data';
import { rome } from '../type';


export interface GameResultData {
  gameId: string;
  winner: string | string[];
  durationSeconds: number;
  isPongGame: boolean;
  isPrivateGame: boolean;
  score: number[];
}


async function updateElo(players: Player[], winnerIds: string[]) {
  const eloBefore = new Map<string, number>();
  players.forEach(p => eloBefore.set(p.id, p.elo));

  const updatedPlayers = calculateElo(players, winnerIds);

  const eloAfter = new Map<string, number>();
  updatedPlayers.forEach(p => eloAfter.set(p.id, p.elo));

  for (const player of updatedPlayers) {
    await User.update({ elo: player.elo }, { where: { id: player.id } });
  }

  return { updatedPlayers, eloBefore, eloAfter };
}


async function saveMatchInDatabase(
  data: GameResultData,
  players: Player[],
  winnerIds: string[],
  eloBefore: Map<string, number> | undefined,
  eloAfter: Map<string, number> | undefined
): Promise<number> {
  const match = await Match.create({
    is_pong_game: data.isPongGame,
    playedAt: new Date(),
    durationSeconds: data.durationSeconds,
  });
  
  for (const player of players) {
    const isWinner = winnerIds.includes(player.id);
    let elo_change = 0;
    if (eloBefore && eloAfter) {
      const before = eloBefore.get(player.id) || 0;
      const after = eloAfter.get(player.id) || before;
      elo_change = after - before;
    }
    
    await MatchPlayer.create({
      matchId: match.id,
      playerId: player.id,
      score: isWinner ? data.score[0]: data.score[1],
      winner: isWinner,
      elo_change: elo_change,
    });
  }

  return match.id;
}

function notifyPlayers(players: Player[], winnerIds: string[], data: GameResultData) {
  players.forEach(player => {
    const isWinner = winnerIds.includes(player.id);
    if (player.ws.readyState === player.ws.OPEN) {
      player.ws.send(JSON.stringify({
        event: 'game_result',
        data: {
          winner: winnerIds,
          score: isWinner ? data.score[0] : data.score[1],
        }
      }));
    }
  });
}

export default async function handleGameResult(data: GameResultData) {
  const game = activeGames.get(data.gameId);
  if (!game) {
    logError("Game not found", data.gameId);
    return;
  }

  try {
    const winnerIds = Array.isArray(data.winner) ? data.winner : [data.winner];
    logformat("Game result", data.gameId, "Winner(s):", winnerIds.join(', '));

    let updatedPlayers = game.players;
    let eloBefore: Map<string, number> | undefined = undefined;
    let eloAfter: Map<string, number> | undefined = undefined;

    if (!data.isPrivateGame) {
      const result = await updateElo(game.players, winnerIds);
      updatedPlayers = result.updatedPlayers;
      eloBefore = result.eloBefore;
      eloAfter = result.eloAfter;
    }

    await saveMatchInDatabase(data, updatedPlayers, winnerIds, eloBefore, eloAfter);
    notifyPlayers(game.players, winnerIds, data);

    activeGames.delete(data.gameId);
  } catch (err) {
    logError("handleGameResult failed", err);
    for (const player of game.players) {
      if (player.ws.readyState === player.ws.OPEN) {
        player.ws.send(JSON.stringify({ event: "game_result", data: { error: "Internal server error" } }));
      }
    }
  }
}
