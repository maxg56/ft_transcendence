import { Player } from "../models/Player";
import { room } from "../type";


export const matchmakingQueue = new Map<string, Player[]>();
export const activeGames = new Map<string, room>();
export const privateGames = new Map<string, { host: Player; nb: number; maxPlayers: number; guest: Player[] }>();
