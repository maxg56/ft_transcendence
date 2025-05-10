

import { v4 as uuidv4 } from 'uuid';
import { Player } from '../models/Player';
import { logformat } from '../utils/log';
import { privateGames, waitingTournaments } from '../config/data';
import { PrivateGame } from '../type';



export function create_private_game(player: Player, data: any) {
  const { nb_players, isTournament = false, tournamentType } = data;

  if (typeof nb_players !== 'number' || nb_players < 2) {
    player.ws.send(JSON.stringify({ event: 'error', message: 'Invalid number of players' }));
    return;
  }

 

  const gameCode = uuidv4().slice(0, 6);
  const game: PrivateGame = {
    host: player,
    nb: 1,
    maxPlayers: nb_players,
    guest: [player],
    isTournament,
  };

  const targetMap = isTournament ? waitingTournaments : privateGames;
  targetMap.set(gameCode, game);

  player.ws.send(JSON.stringify({
    event: isTournament ? 'tournament_created' : 'private_game_created',
    gameCode,
    tournamentType
  }));

  logformat(isTournament ? "Tournament created" : "Private game created", player.id, gameCode);
}
