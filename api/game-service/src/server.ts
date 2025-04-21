import Fastify from 'fastify';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import dotenv from 'dotenv';
import calculateElo from './controllers/calculateElo';
import { verifyToken } from './controllers/JWT';
import database from './plugins/database';
import Match from "./models/Match";
import MatchPlayer from "./models/MatchPlayer";
import User from "./models/User";
import { Player } from './models/Player';
import handleGameResult from './controllers/game_result';
import joinPrivateGame from './controllers/join_private_game';
import { logformat, logError } from "./controllers/log";
import { queue, activeGames, privateGames } from './config/data';
import { MatchFormat,tryMatchmaking , enqueuePlayer } from './controllers/matchmaking';

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

  const player: Player = { id: playerId, name: user.username, ws, elo: user.elo, joinedAt: Date.now() };

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
    queue.splice(queue.findIndex((p) => p.id === player.id), 1);
  });
  ws.on('error', (error) => {
    logError("WebSocket error: \n", error);
  });
  
}

wss.on('connection', (ws: WebSocket, req) => {
  const token = req.url?.split('token=')[1];
  if (token) {
    handleNewConnection(ws, token);
  } else {
    ws.send(JSON.stringify({ event: 'error', message: 'Missing token' }));
    ws.close();
  }
});



async function startGameLoop(gameId: string) {
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
      
    }
  }, 1000 / 60); // 60 FPS
}

// function join_private_game(
//   player: Player,
//   data: any,
//   activeGames: Map<string, { players: Player[], engine: GameEngine }>) {

//   const [playerId, playerUsername] = verifyToken(data.token);
//   if (!playerId || !playerUsername) {
//     logError("Invalid token")
//     return;
//   }

function handleMessage(data: any, player: Player) {
  try {
    switch (data.event) {
      case 'join_queue':
        console.log("Player joined queue:", player.name , player.id , player.elo);
        enqueuePlayer(player,data.format);
        queue.push(player);
        break;
      case 'create_private_game': {
        const gameCode = uuidv4().slice(0, 6);
        privateGames.set(gameCode, { host: player, nb: 1, maxPlayers: data.nb_players, isFriend: data.isFriend, guest: [player] });
        player.ws.send(JSON.stringify({ event: 'private_game_created', gameCode }));
        break;
      }
      case 'join_private_game':
        joinPrivateGame(player, data, privateGames, activeGames);
        break;
      case 'game_result':
        handleGameResult(activeGames, data, player);
        break;
      case 'start_game':
        const game = activeGames.get(data.gameId);
        if (game) {
          startGameLoop(data.gameId);
        }
        break;
      case 'move_paddle': {
        console.log("Move paddle event received:", data);
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
  // { playersPerTeam: 1, teams: 4 }   // 1v1v1v1
];

setInterval(() => {
  for (const format of formats) {
    tryMatchmaking(format);
  }
}, 1000);



server.listen(Number(PORT), () => {
  console.log(`WebSocket Server running on port ${PORT}`);
});
