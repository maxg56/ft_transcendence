import { Player } from "../models/Player";
import { Room } from "../type";


export const matchmakingQueue = new Map<string, Player[]>();
export const activeGames = new Map<string, Room>();
export const privateGames = new Map<string, { host: Player; nb: number; maxPlayers: number; guest: Player[] }>();
