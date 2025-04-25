
import WebSocket, { WebSocket as WS } from 'ws';

export interface Player {
    id: string;
    name: string;
    ws: WS;
    elo: number;
    joinedAt: number;
}

