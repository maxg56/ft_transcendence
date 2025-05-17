import { v4 as uuidv4 } from "uuid";
import { logformat, logError } from "../utils/log";
import { Player } from '../models/Player';
import { waitingTournaments, tournaments } from "../config/data";
import { Tournament } from './Tournament';

// Removed unused imports
async function sendJSON(player: Player, event: string, data: any) {
  if (!player || !player.ws) {
    logError("Player or WebSocket not defined", player);
    return;
  }
  if (player.ws.readyState === 1) {
    player.ws.send(JSON.stringify({ event, data }));
  } else {
    logError("WebSocket not open. Cannot send message.", {
      event,
      data,
      readyState: player.ws.readyState,
    });
  }
}


// Handler to start a tournament game when all players are present
async function stateTournamentGameHandler(player: Player, msg: any) {
  const payload = msg.data;
  const gameCode = payload?.gameCode;
  if (!gameCode) {
    logError("Missing gameCode in stateTournamentGame", payload);
    sendJSON(player, "error", { message: "Missing game code" });
    return;
  }
  const game = waitingTournaments.get(gameCode);
  if (!game || !game.isTournament) {
    // tournament already deleted or invalid code
    sendJSON(player, "error", { message: "Tournament not found" });
    return;
  }
  if (player.id !== game.host.id) {
    sendJSON(player, "error", { message: "You are not the host" });
    return;
  }
  if (game.nb === game.maxPlayers) {
    const gameId = uuidv4();
    logformat("Tournament is full, starting tournament", gameId);
    waitingTournaments.delete(gameCode);

    const players = [game.host, ...game.guest];
    // Create the Tournament instance and store it
    const tourney = new Tournament(players , gameId);
    
    tournaments.set(gameId, tourney);

    // Notify all players
    players.forEach((p) => {
      sendJSON(p, "tournament_start", { gameId });
    });
  }
}



async function joinTournamentGame(player: Player, data: any) {
    if (!data?.gameCode) {
        logError("Missing gameCode in joinTournamentGame", data);
        player.ws.send(JSON.stringify({ event: "error", message: "Missing game code" }));
        return;
    }
    const game = waitingTournaments.get(data.gameCode);

    if (!game || !game.isTournament) {
        logError("Tournament not found or invalid", data.gameCode);
        player.ws.send(JSON.stringify({ event: "error", message: "Tournament not found" }));
        return;
    }

    const host = game.host;

    if (game.nb < game.maxPlayers) {
      game.nb++;
      game.guest.push(player);
  
      const rawPlayers = [host, ...game.guest];
      const existingPlayersInfo = rawPlayers
        .map(p => ({ id: p.id, username: p.name, avatar: p.avatar, isHost: p.id === game.host.id }))
        .filter((p, idx, arr) => arr.findIndex(x => x.id === p.id) === idx);
      sendJSON(player, "joined_game", {
        gameCode: data.gameCode,
        players: existingPlayersInfo
      });
  
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

export {joinTournamentGame, stateTournamentGameHandler};
