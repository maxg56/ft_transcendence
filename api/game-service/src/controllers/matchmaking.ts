import { v4 as uuidv4 } from 'uuid';
import { GameEngineFactory } from './GameEngine/GameEngineFactory';
import { Player } from '../models/Player';
import { logformat, logError } from '../utils/log';
import { WebSocket } from 'ws';
import { activeGames ,matchmakingQueue } from '../config/data';
import { GameMode, Room } from '../type';
import {startAutoMatchGameTimer } from "./startAutoMatchGameTimer";


export interface MatchFormat {
    playersPerTeam: number;
    teams: number;
}
const SUPPORTED_GAME_MODES: Set<GameMode> = new Set(['1v1', '2v2']);

function getQueueKey(format: MatchFormat): GameMode {
  
  if (format.playersPerTeam <= 0 || format.teams <= 0) {
    throw new Error("Invalid match format: playersPerTeam and teams must be greater than 0.");
  }

  const key = `${format.playersPerTeam }v${format.playersPerTeam}` as GameMode;
  if (!SUPPORTED_GAME_MODES.has(key)) {
    throw new Error(`Unsupported match format: ${key}`);
  }
  return key;
}

function safeSend(player: Player, data: object): void {
  try {
    if (player.ws && player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(data));
    } else {
      console.warn(`[match] WebSocket not open for player ${player.id}`);
    }
  } catch (err) {
    console.error(`[match] Failed to send data to player ${player.id}:`, err);
  }
}



export function enqueuePlayer(player: Player, format: MatchFormat) {
    const key = getQueueKey(format);
    const queue = matchmakingQueue.get(key) || [];
    player.joinedAt = Date.now();
    if (queue.find(p => p.id === player.id)) {
        safeSend(player, { event: 'already_in_queue', format });
        return;
    }
    console.log(`[match] Player ${player.id} joined queue for ${key}`);
    queue.push(player);
    matchmakingQueue.set(key, queue);
    safeSend(player, { event: 'join_queue', format });
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
  
export function tryMatchmaking(format: MatchFormat ,isPongGame: boolean = true) {
  const key = getQueueKey(format);
  const queue = matchmakingQueue.get(key) || [];
  const totalPlayers = format.playersPerTeam * format.teams;

  if (queue.length < totalPlayers) return;
  console.log(`[match] Trying to match ${totalPlayers} players in queue for ${key}`);
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
      findMatchWithPlayers(players, format,isPongGame);
      return;
    }
  }
}


function createBalancedTeams(players: Player[], teamSize: number) {
  const totalTeams = players.length / teamSize;
  const teams: { id: number, players: Player[] }[] = Array.from({ length: totalTeams }, (_, i) => ({ id: i + 1, players: [] }));

  players.sort((a, b) => b.elo - a.elo);

  let direction = 1;
  let index = 0;
  for (const player of players) {
    teams[index].players.push(player);
    if (direction === 1) {
      if (index < totalTeams - 1) index++;
      else { direction = -1; index--; }
    } else {
      if (index > 0) index--;
      else { direction = 1; index++; }
    }
  }
  return teams;
}


function getPlayerTeamInfo(player: Player, teams: { id: number, players: Player[] }[]) {
  for (const team of teams) {
    const index = team.players.findIndex(p => p.id === player.id);
    if (index !== -1) {
      return { teamId: team.id, positionInTeam: index };
    }
  }
  return { teamId: -1, positionInTeam: -1 };
}

function createPayload(player: Player, gameId: string, format: MatchFormat, teams: { id: number, players: Player[] }[]) {
  const { teamId, positionInTeam } = getPlayerTeamInfo(player, teams);

  return {
    event: 'match_found',
    gameId,
    format,
    teamId,
    positionInTeam,
    teams: teams.map(t => ({
      id: t.id,
      players: t.players.map(p => ({ id: p.id, name: p.name }))
    }))
  };
}

export function findMatchWithPlayers(players: Player[], format: MatchFormat, isPongGame: boolean) {
  const gameId = uuidv4();
  const mode: GameMode = getQueueKey(format);
  const engine = GameEngineFactory.createEngine(mode);
  const teamSize = format.playersPerTeam;

  const teams = createBalancedTeams(players, teamSize);

  const room: Room = {
    players,
    mode,
    engine,
    teams: new Map(teams.map(t => [t.id, t.players])),
    isPongGame,
    isPrivateGame: false,
    autoStartTimer: null,
    startTime: new Date(),
  };

  activeGames.set(gameId, room);
  startAutoMatchGameTimer(gameId);

  players.forEach((player) => {

    const payload = createPayload(player, gameId, format, teams);
    safeSend(player, payload);
  });

  logformat("Match created", "format", `${format.teams} teams of ${format.playersPerTeam}`, "gameId", gameId);
}

export function cleanMatchmakingQueues(timeoutSeconds = 120, now = Date.now()) {
  for (const [key, queue] of matchmakingQueue.entries()) {
    const filteredQueue = queue.filter(player => {
      const isActive = player.ws && player.ws.readyState === WebSocket.OPEN;
      const isRecent = (now - player.joinedAt) < timeoutSeconds * 1000;

      if (!isActive || !isRecent) {
        console.log(`[match] Removing inactive/expired player ${player.id} from ${key}`);

        // Envoie un message au client s’il est encore connecté
        if (player.ws && player.ws.readyState === WebSocket.OPEN) {
          player.ws.send(JSON.stringify({
            event: 'matchmaking_removed',
            data: {},
          }));
        }
      }

      return isActive && isRecent;
    });

    if (filteredQueue.length > 0) {
      matchmakingQueue.set(key, filteredQueue);
    } else {
      matchmakingQueue.delete(key);
      console.log(`[match] Removed empty queue for ${key}`);
    }
  }
}


  
