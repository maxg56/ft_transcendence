import { Player } from "../models/Player";
import { v4 as uuidv4 } from "uuid";
import { logformat, logError } from "../utils/log";
import { activeGames, privateGames } from "../config/data";
import { GameEngineFactory } from "./GameEngine/GameEngineFactory";
import { startAutoMatchGameTimer } from "./startAutoMatchGameTimer";
import { Room } from "../type";

function sendJSON(player: Player, event: string, data: any) {
  player.ws.send(JSON.stringify({ event, data }));
}

async function joinPrivateGame(player: Player, data: any) {
  if (!data?.gameCode) {
    logError("Missing gameCode in joinPrivateGame", data);
    sendJSON(player, "error", { message: "Missing game code" });
    return;
  }

  const game = privateGames.get(data.gameCode);

  if (!game) {
    logError("Game not found", data.gameCode);
    sendJSON(player, "error", { message: "Game not found" });
    return;
  }

  if (game.guest.find(p => p.id === player.id)) {
    sendJSON(player, "error", { message: "Already joined this game" });
    return;
  }

  const host = game.host;

  if (game.nb < game.maxPlayers) {
    game.nb++;
    game.guest.push(player);

    const joinData = {
      gameCode: data.gameCode,
      host: host.id,
      NameHost: host.name,
      guest: player.id
    };

    sendJSON(player, "joined_game", joinData);
    sendJSON(host, "guest_joined", joinData);

    logformat("Player joined private game", player.id, data.gameCode);
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

    const teamsResponse = players.map((pl, i) => ({
      id: i + 1,
      players: [{ id: pl.id, name: pl.name }]
    }));

    players.forEach((p, idx) => {
      sendJSON(p, "match_found", {
        gameId,
        format: { teams: 2, playersPerTeam: 1 },
        teamId: idx + 1,
        positionInTeam: 0,
        teams: teamsResponse
      });
    });
  }
}

export default joinPrivateGame;
