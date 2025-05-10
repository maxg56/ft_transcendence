
import WebSocket, { WebSocket as WS } from 'ws';

export interface Player {
    id: string;
    name: string;
    ws: WS;
    elo: number;
    avatar: string | null;
    joinedAt: number;
}

