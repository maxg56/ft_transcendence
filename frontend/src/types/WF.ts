export type Players = {
    name: string;
    id: string;
  };
  
export type Team = {
    id: string;
    players: Players[];
  };
  
export type Player = {
    isHost: boolean;
    username: string;
    avatar: string | null;
};