import { v4 as uuidv4 } from 'uuid';
import { Player } from '../models/Player';
import { logformat } from '../utils/log';
import { privateGames, waitingTournaments } from '../config/data';
import { PrivateGame } from '../type';
import User from "../models/User";// Import du modèle User

export async function create_private_game(player: Player, data: any) {
  const { nb_players, isTournament = false } = data;

  if (player.ws.readyState !== WebSocket.OPEN) {
    return;
  }

  if (typeof nb_players !== 'number' || nb_players < 2) {
    player.ws.send(JSON.stringify({
      event: 'error',
      message: 'Invalid number of players'
    }));
    return;
  }
  
  const gameCode = uuidv4().slice(0, 4);
  const game: PrivateGame = {
    host: player,
    nb: 1,
    maxPlayers: nb_players,
    guest: [], // ne plus ajouter l'hôte dans guest
    isTournament,
  };


  const targetMap = isTournament ? waitingTournaments : privateGames;
  targetMap.set(gameCode, game);

  // Recherche de l'utilisateur par son ID dans la base de données
  try {
    // Envoi de la réponse à l'utilisateur avec le nom et la photo de profil
    if (player.ws.readyState === WebSocket.OPEN) {

      player.ws.send(JSON.stringify({
        event: isTournament ? 'tournament_created' : 'private_game_created',
        data: {
          gameCode,
          player: {
            isHost: true,
            username: player.name,
            avatar: player.avatar
          }
        },
      }));

      logformat(
        isTournament ? "Tournament created" : "Private game created",
        player.id,
        gameCode
      );
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    player.ws.send(JSON.stringify({
      event: 'error',
      message: 'Error fetching user data'
    }));
  }
}
