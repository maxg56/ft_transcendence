import { Player } from "../models/Player";
import { v4 as uuidv4 } from "uuid";
import { logformat, logError } from "../utils/log";
import { waitingTournaments, activeGames } from "../config/data";
import { GameEngineFactory } from "./GameEngine/GameEngineFactory";
import { startAutoMatchGameTimer } from "./startAutoMatchGameTimer";
import { Room } from "../type";

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

        const payload = {
          event: "join_tournament_game",
          data: {
            gameId: data.gameId,
            host: host.id,
            hostName: host.name,
            guest: player.id,
          }
        };

        player.ws.send(JSON.stringify(payload));
        host.ws.send(JSON.stringify(payload));
        logformat("Player joined tournament", player.id, data.gameId);
      }

    if (game.nb === game.maxPlayers) {
        const gameId = uuidv4();
        logformat("Tournament full, starting", gameId);
        waitingTournaments.delete(data.gameCode);

        const players = game.guest;
        const teams = new Map<number, Player[]>();
        players.forEach((p, idx) => {
            teams.set(idx + 1, [p]);
        });

        // const room: Room = {
        //   players,
        //   engine: GameEngineFactory.createEngine("tournament"),
        //   teams,
        //   autoStartTimer: null,
        //   mode: "tournament",
        //   isPrivateGame: true,
        //   isPongGame: true,
        //   startTime: new Date(),
        // };

        // activeGames.set(gameId, room);
        // startAutoMatchGameTimer(gameId);

        // players.forEach((p, idx) => {
        //   p.ws.send(JSON.stringify({
        //     event: "tournament_start",
        //     gameId,
        //     format: { teams: players.length, playersPerTeam: 1 },
        //     teamId: idx + 1,
        //     positionInTeam: 0,
        //     teams: players.map((pl, i) => ({
        //       id: i + 1,
        //       players: [{ id: pl.id, name: pl.name }]
        //     }))
        //   }));
        // });
      }
}

export default joinTournamentGame;
