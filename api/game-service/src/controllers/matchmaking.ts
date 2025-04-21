import { v4 as uuidv4 } from 'uuid';
import { GameEngine } from './GameEngine';
import { Player } from '../models/Player';
import { logformat, logError } from './log';
import { WebSocket } from 'ws';
import { activeGames ,matchmakingQueue } from '../config/data';


export interface MatchFormat {
    playersPerTeam: number;
    teams: number;
}

function getQueueKey(format: MatchFormat): string {
    return `${format.playersPerTeam}v${format.teams}`;
}

export function enqueuePlayer(player: Player, format: MatchFormat) {
    const key = getQueueKey(format);
    const queue = matchmakingQueue.get(key) || [];
    player.joinedAt = Date.now();
    queue.push(player);
    matchmakingQueue.set(key, queue);
}
  

function* generateCombinations(n: number, k: number): Generator<number[]> {
    const indices = Array.from({ length: k }, (_, i) => i);
    while (indices[0] < n - k + 1) {
      yield [...indices];
      let t = k - 1;
      while (t !== 0 && indices[t] === n - k + t) t--;
      indices[t]++;
      for (let i = t + 1; i < k; i++) {
        indices[i] = indices[i - 1] + 1;
      }
    }
}

function getAcceptableRange(seconds: number): number {
    const base = 100;
    const perSecond = 10;
    return base + seconds * perSecond;
}
  
export function tryMatchmaking(format: MatchFormat) {
  const key = getQueueKey(format);
  const queue = matchmakingQueue.get(key) || [];
  const totalPlayers = format.playersPerTeam * format.teams;

  if (queue.length < totalPlayers) return;

  const now = Date.now();

  for (let indices of generateCombinations(queue.length, totalPlayers)) {
    const players = indices.map(i => queue[i]);
    const waitTime = Math.min(...players.map(p => (now - p.joinedAt) / 1000));
    const allowedDiff = getAcceptableRange(waitTime);

    const maxLot = Math.max(...players.map(p => p.elo));
    const minLot = Math.min(...players.map(p => p.elo));

    if (maxLot - minLot <= allowedDiff) {
      indices.sort((a, b) => b - a).forEach(i => queue.splice(i, 1));
      matchmakingQueue.set(key, queue);
      findMatchWithPlayers(players, format);
      return;
    }
  }
}


export function findMatchWithPlayers(players: Player[], format: MatchFormat) {
    const gameId = uuidv4();
    const engine = new GameEngine();
    activeGames.set(gameId, { players, engine });
  
    const teams: { id: number, players: Player[] }[] = [];
    const teamSize = format.playersPerTeam;
  
    for (let i = 0; i < players.length; i += teamSize) {
      const teamPlayers = players.slice(i, i + teamSize);
      teams.push({ id: i / teamSize + 1, players: teamPlayers });
    }
  
    players.forEach((player) => {
      const team = teams.find(t => t.players.some(p => p.id === player.id));
      const payload = {
        event: 'match_found',
        gameId,
        format,
        teamId: team?.id ?? -1,
        teams: teams.map(t => ({
          id: t.id,
          players: t.players.map(p => ({ id: p.id, name: p.name }))
        }))
      };
  
      if (player.ws.readyState === WebSocket.OPEN) {
        player.ws.send(JSON.stringify(payload));
      }
    });
  
    logformat("Match created", "format", `${format.teams} teams of ${format.playersPerTeam}`, "gameId", gameId);
  }
  
  
