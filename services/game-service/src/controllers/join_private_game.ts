import User from "../models/User";
import Friendship from "../models/Friendship";
import { Player } from "../models/Player";
import { v4 as uuidv4 } from "uuid";
import { Op } from 'sequelize';
import {logformat,logError} from "./log"


async function joinPrivateGame(
  player: Player,
  data: any,
  privateGames: Map<string, { host: Player; nb: number; maxPlayers: number; isFriend: Boolean; guest: Player[] }>,
  activeGames: Map<string, Player[]>
) {
  const game = privateGames.get(data.gameCode);

  
  if (!game) {
    logError("Game not found", data.gameCode);
    player.ws.send(JSON.stringify({ event: "error", message: "Game not found" }));
    return;
  }

  const host = game.host;

  if (game.isFriend) {
    try {
      const isFriend = await Friendship.findOne({
        where: {
          [Op.or]: [
            { user1: player.id, user2: host.id },
            { user1: host.id, user2: player.id },
          ],
        },
      });

      if (!isFriend) {
        logError("Not friends with the host", player.id, host.id);
        player.ws.send(JSON.stringify({ event: "error", message: "You are not friends with the host" }));
        return;
      }
    } catch (error) {
      logError("Database error while checking friendship:", error);
      player.ws.send(JSON.stringify({ event: "error", message: "An error occurred. Try again later." }));
      return;
    }
  }

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
    activeGames.set(gameId, game.guest);

    for (const guest of game.guest) {
      guest.ws.send(JSON.stringify({ event: "match_found", gameId }));
    }
  }
}


export default joinPrivateGame;