import { Types } from "mysql2";
import { GameEngine } from "./controllers/GameEngine/type";
import { Player } from "./models/Player";

export type Vector = { x: number; z: number };
export type Position = { x: number; z: number };


export type PlayerSide1v1 = 'left' | 'right';
export type PlayerSide2v2 = 'left' | 'right' | 'left2' | 'right2';
export type TeamScore = { left: number; right: number };
export type GameScore1v1 = Record<PlayerSide1v1, number>;
export type GameScore2v2 = Record<PlayerSide2v2, number>;

export type PlayerSide = PlayerSide2v2; // Si tu veux un superset par défaut
export type GameScore = GameScore1v1 | GameScore2v2 | TeamScore ;
    

export type Room = { 
    players: Player[],
    teams: Map<number, Player[]>,
    engine: GameEngine ,
    autoStartTimer: NodeJS.Timeout | null,
    mode: GameMode,
    isPrivateGame: boolean,
    isPongGame: boolean,
    startTime: Date 
};
export interface PrivateGame {
    host: Player;
    nb: number;
    maxPlayers: number;
    guest: Player[];
    isTournament: boolean;
}

export type GameMode = '1v1' | '2v2';