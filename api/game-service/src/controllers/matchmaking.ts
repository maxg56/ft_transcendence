import { v4 as uuidv4 } from 'uuid';
import { GameEngineFactory } from './GameEngine/GameEngineFactory';
import { Player } from '../models/Player';
import { logformat, logError } from './log';
import { WebSocket } from 'ws';
import { activeGames ,matchmakingQueue } from '../config/data';
import { GameMode, Room } from '../type';
import {startAutoMatchGameTimer } from "./startAutoMatchGameTimer";


export interface MatchFormat {
    playersPerTeam: number;
    teams: number;
}

function getQueueKey(format: MatchFormat): GameMode {
  
  if (format.playersPerTeam <= 0 || format.teams <= 0) {
    throw new Error("Invalid match format: playersPerTeam and teams must be greater than 0.");
  }

  const key = `${format.playersPerTeam }v${format.playersPerTeam}` as GameMode;
  if (key !== '1v1' && key !== '2v2') {
    throw new Error(`Unsupported match format: ${key}`);
  }
  return key;
}

export function enqueuePlayer(player: Player, format: MatchFormat) {
    const key = getQueueKey(format);
    const queue = matchmakingQueue.get(key) || [];
    player.joinedAt = Date.now();
    if (queue.find(p => p.id === player.id)) {
        player.ws.send(JSON.stringify({ event: 'already_in_queue', format }));
        return;
    }
    queue.push(player);
    matchmakingQueue.set(key, queue);
    player.ws.send(JSON.stringify({ event: 'join_queue', format }));
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


function createTeams(players: Player[], teamSize: number): { id: number, players: Player[] }[] {
  if (players.length % teamSize !== 0) {
    throw new Error("Invalid player count for the specified format.");
  }

  const teams = [];
  for (let i = 0; i < players.length; i += teamSize) {
    const teamPlayers = players.slice(i, i + teamSize);
    teams.push({ id: i / teamSize + 1, players: teamPlayers });
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

  const teams = createTeams(players, teamSize);

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

    try {
      if (player.ws && player.ws.readyState === WebSocket.OPEN) {
        player.ws.send(JSON.stringify(payload));
      } else {
        console.warn(`[match] Could not send match_found to player ${player.id}: WebSocket not open`);
      }
    } catch (err) {
      console.error(`[match] Error sending match_found to player ${player.id}:`, err);
    }
  });

  logformat("Match created", "format", `${format.teams} teams of ${format.playersPerTeam}`, "gameId", gameId);
}


  
