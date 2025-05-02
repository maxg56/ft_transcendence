import { Player } from "../models/Player";
import { v4 as uuidv4 } from "uuid";
import {logformat,logError} from "./log"
import { activeGames, privateGames } from "../config/data";
import { GameEngineFactory } from "./GameEngine/GameEngineFactory";
import {startAutoMatchGameTimer } from "./startAutoMatchGameTimer";
import { Room } from "../type";


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

    const players = game.guest;
    const teams = new Map<number, Player[]>();
    players.forEach((p, idx) => {
      teams.set(idx + 1, [p]); // one player per team
    });

    const room: Room = {
      players,
      engine: GameEngineFactory.createEngine("1v1"),
      teams,
      autoStartTimer: null,
      mode: "1v1",
      isPrivateGame: true,
      isPongGame: true,
      startTime: new Date(),
    };

    activeGames.set(gameId, room);
    startAutoMatchGameTimer(gameId);

    players.forEach((p, idx) => {
      p.ws.send(JSON.stringify({
        event: "match_found",
        gameId,
        format: { teams: 2, playersPerTeam: 1 },
        teamId: idx + 1,
        positionInTeam: 0, // always 0 in 1v1
        teams: players.map((pl, i) => ({
          id: i + 1,
          players: [{ id: pl.id, name: pl.name }]
        }))
      }));
    });
  }
}



export default joinPrivateGame;