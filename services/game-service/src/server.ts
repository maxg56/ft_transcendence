import Fastify from 'fastify';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import dotenv from 'dotenv';
import routes from './routes/index';
import calculateElo from './controllers/calculateElo';
import verifyToken from './controllers/JWT';
import database from './plugins/database';
import Match from "./models/Match";
import MatchPlayer from "./models/MatchPlayer";
import User from "./models/User";
import {Player} from './models/Player';
import handleGameResult from './controllers/game_result';

dotenv.config();

const fastify = Fastify({ logger: true });
const server = createServer(fastify.server);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT_GAME || 3000;



fastify.register(database);

fastify.ready().then(() => {
  console.log("📌 Fastify is ready, initializing models...");
  console.log("✅ User model loaded:", !!User);
  console.log("✅ Match model loaded:", !!Match);
  console.log("✅ MatchPlayer model loaded:", !!MatchPlayer);
});

const queue: Player[] = [];
const activeGames = new Map<string, Player[]>();
const privateGames = new Map<string, { host: Player; guest?: Player }>();


async function addUser(id: string): Promise<User | null> {
  return await User.findOne({ where: { id } });
}

async function handleNewConnection(ws: WebSocket, token: string) {
  const [playerId, playerUsername] = verifyToken(token);
  if (!playerId || !playerUsername) {
    ws.send(JSON.stringify({ event: 'error', message: 'Invalid token' }));
    ws.close();
    return;
  }

  const user = await addUser(playerId);
  if (!user) {
    ws.send(JSON.stringify({ event: 'error', message: 'User not found' }));
    ws.close();
    return;
  }

  const player: Player = { id: playerId, ws, elo: user.elo };

  ws.on('message', (message: string) => {
    const data = JSON.parse(message);
    handleMessage(data, player);
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

    players.forEach((player) => {
      const opponentIds = players.filter((p) => p.id !== player.id).map((p) => p.id);
      player.ws.send(JSON.stringify({ event: 'match_found', gameId, opponent: opponentIds }));
    });
  }
}

function handleMessage(data: any, player: Player) {
  switch (data.event) {
    case 'join_queue':
      queue.push(player);
      findMatch();
      break;
    case 'create_private_game':
      const gameCode = uuidv4().slice(0, 6);
      privateGames.set(gameCode, { host: player });
      player.ws.send(JSON.stringify({ event: 'private_game_created', gameCode }));
      break;
    case 'join_private_game':
      const privateGame = privateGames.get(data.gameCode);
      if (privateGame && !privateGame.guest) {
        privateGame.guest = player;
        const gameId = uuidv4();
        activeGames.set(gameId, [privateGame.host, player]);

        privateGame.host.ws.send(JSON.stringify({ event: 'match_found', gameId, opponent: player.id }));
        player.ws.send(JSON.stringify({ event: 'match_found', gameId, opponent: privateGame.host.id }));
        privateGames.delete(data.gameCode);
      } else {
        player.ws.send(JSON.stringify({ event: 'private_game_not_found' }));
      }
      break;
    case 'game_result':
      // TODO: Update player ELO and save match result
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
}

server.listen(Number(PORT), () => {
  console.log(`WebSocket Server running on port ${PORT}`);
});
