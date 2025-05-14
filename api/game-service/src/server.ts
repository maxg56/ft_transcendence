import Fastify from 'fastify';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { verifyToken } from './utils/JWT';
import database from './plugins/database';
import Match from "./models/Match";
import MatchPlayer from "./models/MatchPlayer";
import User from "./models/User";
import { Player } from './models/Player';

import { joinPrivateGame, statePrivateGameHandler } from './controllers/join_private_game';
import {create_private_game} from './controllers/create_private_game';
import { joinTournamentGame, stateTournamentGameHandler } from './controllers/joinTournamentGame';
import { logformat, logError } from "./utils/log";
import {activeGames, privateGames , matchmakingQueue, tournaments } from './config/data';
import { MatchFormat,tryMatchmaking , enqueuePlayer, cleanMatchmakingQueues } from './controllers/matchmaking';

dotenv.config();

const fastify = Fastify({ logger: true });
const server = createServer(fastify.server);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT_GAME || 3000;

fastify.register(database);

fastify.ready().then(() => {
  logformat("\n\n📌 Fastify is ready, initializing models...\n",
    "✅ User model loaded:", !!User, "\n",
    "✅ Match model loaded:", !!Match, "\n",
    "✅ MatchPlayer model loaded:", !!MatchPlayer
  )
});

async function addUser(id: string): Promise<User | null> {
  return await User.findOne({ where: { id } });
}

async function handleNewConnection(ws: WebSocket, token: string) {
  const [playerId, playerUsername] = verifyToken(token);
  if (!playerId || !playerUsername) {
    logError("Invalid token")
    ws.send(JSON.stringify({ event: 'error', message: 'Invalid token' }));
    ws.close();
    return;
  }

  const user = await addUser(playerId);
  if (!user) {
    logError("User not found")
    ws.send(JSON.stringify({ event: 'error', message: 'User not found' }));
    ws.close();
    return;
  }

  const player: Player = { id: playerId, name: user.username, ws, elo: user.elo, joinedAt: Date.now() , avatar: user.avatar};

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      handleMessage(data, player);
    } catch (error) {
      logError("Error parsing message: \n", error);
      ws.send(JSON.stringify({ event: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    for (const [key, queue] of matchmakingQueue.entries()) {
      const index = queue.findIndex((p) => p.id === player.id);
      if (index !== -1) 
        queue.splice(index, 1);
      matchmakingQueue.set(key, queue);
    }
  });
  ws.on('error', (error) => {
    logError("WebSocket error: \n", error);
  });
  
}

wss.on('connection', (ws: WebSocket, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const token = url.searchParams.get('token');
  if (token) {
    handleNewConnection(ws, token);
  } else {
    ws.send(JSON.stringify({ event: 'error', message: 'Missing token' }));
    ws.close();
  }
});


function handleMessage(data: any, player: Player) {
  try {
    switch (data.event) {
      case 'join_queue':
        enqueuePlayer(player,data.format);
        break;
      case 'create_private_game':
        create_private_game(player, data);
        break;
      case 'join_private_game':
        joinPrivateGame(player, data);
        break;
      case 'state_private_game':
        statePrivateGameHandler(player, data);
        break;
      case 'join_tournament_game': {
        joinTournamentGame(player, data);
        break;
      }
      case 'tournament_state': {
        stateTournamentGameHandler(player, data);
        break;
      }
      case 'ack': {
        // Gestion ack tournoi :
        const { step, matchId } = data;
        if (!step || !matchId) break;
        const tournament = tournaments.get(matchId);
        if (!tournament) break;
        // Vérifie que player est l'host du tournoi
        if (tournament.getHostId && typeof tournament.getHostId === 'function') {
          if (player.id !== tournament.getHostId()) break;
        } else if (tournament.hostId && player.id !== tournament.hostId) {
          break;
        }
        break;
      }
      case 'tournament_next_step': {
        const { tournamentId, hostId } = data;
        const tournament = tournaments.get(tournamentId);
        if (tournament && tournament.hostId === hostId) {
          tournament.startNextStep(hostId);
        }
        console.log("Tournament next step", tournamentId, hostId);
        break;
      }
      case 'move_paddle': {
        const game = activeGames.get(data.gameId);
        if (game) {
          game.engine.movePaddle(data.side, data.direction);
        }
        break;
      }
    }
  } catch (error) {
    console.error("Error handling message:", error);
    player.ws.send(JSON.stringify({ event: 'error', message: 'An error occurred while processing your request.' }));
  }
}

const formats: MatchFormat[] = [
  { playersPerTeam: 1, teams: 2 },  // 1v1
  { playersPerTeam: 2, teams: 2 },  // 2v2
];

setInterval(() => {
  (async () => {
    for (const format of formats) {
      try {
        tryMatchmaking(format);
      } catch (err) {
        logError("Matchmaking error for format:", format, err);
      }
      
    }
    cleanMatchmakingQueues();
  })();
}, 1000);


server.listen(Number(PORT), () => {
  console.log(`WebSocket Server running on port ${PORT}`);
});
