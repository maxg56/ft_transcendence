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

    // Nouveau joueur : reçoit la liste des joueurs déjà présents
    const existingPlayersInfo = [host, ...game.guest.filter(p => p.id !== player.id)].map(p => ({
      id: p.id,
      username: p.name,
      avatar: p.avatar,
      isHost: p.id === game.host.id,
    }));

    sendJSON(player, "joined_game", {
      gameCode: data.gameCode,
      existingPlayers: existingPlayersInfo
    });

    // Tous les autres joueurs reçoivent les infos du nouveau joueur
    const newPlayerInfo = {
      id: player.id,
      username: player.name,
      avatar: player.avatar,
      isHost: false
    };

    [host, ...game.guest.filter(p => p.id !== player.id)].forEach(p => {
      sendJSON(p, "new_player_joined", { player: newPlayerInfo });
    });

    logformat("Player joined private game", player.id, data.gameCode);
  }
  else {
    sendJSON(player, "error", { message: "Game is full" });
    logError("Game is full", data.gameCode);
  }
}

async function statePrivateGameHandler(player: Player, data: any) {
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
  if ( player.id !== game.host.id) {
    sendJSON(player, "error", { message: "You are not the host" });
    return;
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

export { joinPrivateGame, statePrivateGameHandler };
