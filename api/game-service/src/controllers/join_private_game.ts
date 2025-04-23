import { Player } from "../models/Player";
import { v4 as uuidv4 } from "uuid";
import {logformat,logError} from "./log"
import { activeGames, privateGames } from "../config/data";
import { GameEngineFactory } from "./GameEngineFactory";
import {startAutoMatchGameTimer } from "./startAutoMatchGameTimer";
import { room } from "../type";


async function joinPrivateGame(
  player: Player,
  data: any
) {
  const game = privateGames.get(data.gameCode);

  if (!game) {
    logError("Game not found", data.gameCode);
    player.ws.send(JSON.stringify({ event: "error", message: "Game not found" }));
    return;
  }

  const host = game.host;

  if (game.nb < game.maxPlayers) {

    game.nb++;
    game.guest.push(player);
    player.ws.send(JSON.stringify({ event: "join_private_game", data: { gameId: data.gameId, host: host.id , NameHost: host.name, guest: player.id} }));
    host.ws.send(JSON.stringify({ event: "join_private_game", data: { gameId: data.gameId, host: host.id , NameHost: host.name, guest: player.id} }));
    logformat("Player joined private game", player.id, data.gameId);
  }

  if (game.nb === game.maxPlayers) {
    const gameId = uuidv4();
    logformat("Game is full, starting game", gameId);
    privateGames.delete(data.gameCode);
    const room : room = {
      players: game.guest,
      engine: GameEngineFactory.createEngine("1v1"),
      autoStartTimer: null,
      mode: "1v1",
      isPrivateGame: true,
      isPongGame: true,
      startTime: new Date(),
    }

    
    activeGames.set(gameId, room);
    startAutoMatchGameTimer(gameId);

    for (const guest of game.guest) {
      guest.ws.send(JSON.stringify({ event: "match_found", gameId }));
    }
  }
}


export default joinPrivateGame;