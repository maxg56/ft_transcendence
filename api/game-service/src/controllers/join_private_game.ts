import { Player } from "../models/Player";
import { v4 as uuidv4 } from "uuid";
import {logformat,logError} from "./log"
import { GameEngine } from "./GameEngine";
import { activeGames, privateGames } from "../config/data";


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
    activeGames.set(gameId, { players: game.guest, engine: new GameEngine() });

    for (const guest of game.guest) {
      guest.ws.send(JSON.stringify({ event: "match_found", gameId }));
    }
  }
}


export default joinPrivateGame;