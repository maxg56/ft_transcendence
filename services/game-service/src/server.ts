import Fastify from 'fastify';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import dotenv from 'dotenv';
import calculateElo from './controllers/calculateElo';
import {verifyToken} from './controllers/JWT';
import database from './plugins/database';
import Match from "./models/Match";
import MatchPlayer from "./models/MatchPlayer";
import User from "./models/User";
import {Player} from './models/Player';
import handleGameResult from './controllers/game_result';
import joinPrivateGame from './controllers/join_private_game';
import { logformat, logError } from "./controllers/log";

dotenv.config();

const fastify = Fastify({ logger: true });
const server = createServer(fastify.server);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT_GAME || 3000;



fastify.register(database);

fastify.ready().then(() => {
  logformat(" \n\n📌 Fastify is ready, initializing models...\n",
    "✅ User model loaded:", !!User,"\n",
    "✅ Match model loaded:", !!Match, "\n",
    "✅ MatchPlayer model loaded:", !!MatchPlayer
  )
});

const queue: Player[] = [];
const activeGames = new Map<string, Player[]>();
const privateGames = new Map<string, { host: Player; nb: number; maxPlayers: number; isFriend: Boolean; guest: Player[]} >();


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

  const player: Player = { id: playerId ,name : user.username, ws, elo: user.elo };

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

function findMatch(nb_players: number = 2) {
  if (queue.length >= nb_players) {
    const players: Player[] = queue.splice(0, nb_players);
    const gameId = uuidv4();
    activeGames.set(gameId, players);
    logformat("Game is full, starting game", gameId);

    players.forEach((player) => {
      const opponent = players.find((p) => p.id !== player.id);
      if (opponent) {
        player.ws.send(JSON.stringify({
          event: 'match_found',
          gameId,
          opponent: opponent.id,
          name: opponent.name,
          id: player.id
        }));
      }
    });
  }
}


function handleMessage(data: any, player: Player) {
  try {
    switch (data.event) {
      case 'join_queue':
        queue.push(player);
        findMatch();
        break;
      case 'create_private_game':
        const gameCode = uuidv4().slice(0, 6);
        privateGames.set(gameCode, { host: player, nb : 1  , maxPlayers : data.nb_players, isFriend: data.isFriend, guest: [player] });
        player.ws.send(JSON.stringify({ event: 'private_game_created', gameCode }));
        break;
      case 'join_private_game':
        joinPrivateGame(player, data, privateGames, activeGames);
        break;
      case 'game_result':
        handleGameResult(activeGames, data, player);
        break;
      case 'game_update':
        const activeGame = activeGames.get(data.gameId);
        if (activeGame) {
          activeGame.forEach((p) => {
            p.ws.send(JSON.stringify({ event: 'game_update', data: data.payload, sender: data.sender }));
          });
        }
        break;
    }
  } catch (error) {
    console.error("Error handling message:", error);
    player.ws.send(JSON.stringify({ event: 'error', message: 'An error occurred while processing your request.' }));
  }
}
   
server.listen(Number(PORT), () => {
  console.log(`WebSocket Server running on port ${PORT}`);
});
