import calculateElo from './calculateElo';
import Match from "../models/Match";
import MatchPlayer from "../models/MatchPlayer";
import User from "../models/User";
import { Player } from "../models/Player";
import { logformat, logError } from "./log";
import { activeGames } from '../config/data';
import { GameScore, TeamScore,GameScore1v1,GameScore2v2 } from '../type';


export interface GameResultData {
  gameId: string;
  winner: string | string[];
  durationSeconds: number;
  isPongGame: boolean;
  isPrivateGame: boolean;
  score:GameScore ;
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
    duration_seconds: data.durationSeconds,
  });

  const isTeamScore = (score: GameScore): score is TeamScore =>
    'left' in score && 'right' in score && !('left2' in score || 'right2' in score);

  const isGameScore2v2 = (score: GameScore): score is GameScore2v2 =>
    'left2' in score && 'right2' in score;

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const isWinner = winnerIds.includes(player.id);
    const before = eloBefore?.get(player.id) ?? 0;
    const after = eloAfter?.get(player.id) ?? before;
    const elo_change = after - before;

    let score = 0;

    if (isTeamScore(data.score)) {
      // Match par équipe : chaque équipe a un seul score
      score = isWinner ? data.score.left : data.score.right;
    } else if (isGameScore2v2(data.score)) {
      // 2v2 individuel
      const sides: (keyof GameScore2v2)[] = ['left', 'left2', 'right', 'right2'];
      const side = sides[i] ?? 'left';
      score = data.score[side];
    } else {
      // 1v1
      const sides: (keyof GameScore1v1)[] = ['left', 'right'];
      const side = sides[i] ?? 'left';
      score = data.score[side];
    }
    console.log("score", score , "isWinner", isWinner, "elo_change", elo_change);
    await MatchPlayer.create({
      match_id: match.id,
      player_id: player.id,
      score,
      winner: isWinner,
      elo_change,
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
          score: data.score,
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

    const winner = data.winner === "left" ? game.teams.get(1) : game.teams.get(2);
    const winnerIds = winner ?.map(player => player.id) ?? [];
    logformat("Game result", data.gameId, "Winner(s):", winnerIds.join(", "),);

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
