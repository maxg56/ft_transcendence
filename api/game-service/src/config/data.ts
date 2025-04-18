import { Player } from "../models/Player";


export const queue: Player[] = [];
export const activeGames = new Map<string, Player[]>();
export const privateGames = new Map<string, { host: Player; nb: number; maxPlayers: number; isFriend: Boolean; guest: Player[]} >();
