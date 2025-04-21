import { Player } from "../models/Player";
import { GameEngine } from "../controllers/GameEngine";


export const queue : Player[] = [];
export const matchmakingQueue = new Map<string, Player[]>();

export const activeGames = new Map<string, { players: Player[], engine: GameEngine }>();
export const privateGames = new Map<string, { host: Player; nb: number; maxPlayers: number; isFriend: Boolean; guest: Player[] }>();
