import { Player } from "../models/Player";
import { GameEngine } from "../controllers/GameEngine";
import { rome } from "../type";


export const matchmakingQueue = new Map<string, Player[]>();

export const activeGames = new Map<string, rome>();
export const privateGames = new Map<string, { host: Player; nb: number; maxPlayers: number; guest: Player[] }>();
