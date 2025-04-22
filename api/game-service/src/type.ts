import { Types } from "mysql2";
import { GameEngine } from "./controllers/GameEngine";
import { Player } from "./models/Player";

export type Vector = { x: number; z: number };
export type Position = { x: number; z: number };
export type PlayerSide = 'left' | 'right';
export type rome = { players: Player[], engine: GameEngine }