import { Player } from "../models/Player";
import { Room } from "../type";
import { PrivateGame } from '../type';
import { Tournament } from '../controllers/Tournament';

export const matchmakingQueue = new Map<string, Player[]>();
export const activeGames = new Map<string, Room>();
export const privateGames = new Map<string, PrivateGame>();
export const waitingTournaments = new Map<string,PrivateGame >();
export const tournaments = new Map<string,Tournament >();

