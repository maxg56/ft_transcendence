import { create } from "zustand";

export type Player = {
  isHost: boolean;
  username: string;
  avatar: string | null;
};

type Match = any; // tu peux le typer mieux si tu veux
type Result = any;
type Ranking = any;

type WaitroomState = {
  code: string;
  players: Player[];
  isTournament: boolean;
  tournamentStatus: string;
  matches: Match[];
  lastResults: Result[];
  ranking: Ranking[];

  setCode: (code: string) => void;
  setPlayers: (players: Player[]) => void;
  setIsTournament: (is: boolean) => void;
  setTournamentStatus: (status: string) => void;
  setMatches: (matches: Match[]) => void;
  setLastResults: (results: Result[]) => void;
  setRanking: (ranking: Ranking[]) => void;
};

export const useWaitroomStore = create<WaitroomState>((set) => ({
  code: "",
  players: [],
  isTournament: false,
  tournamentStatus: "",
  matches: [],
  lastResults: [],
  ranking: [],

  setCode: (code) => set({ code }),
  setPlayers: (players) => set({ players }),
  setIsTournament: (is) => set({ isTournament: is }),
  setTournamentStatus: (status) => set({ tournamentStatus: status }),
  setMatches: (matches) => set({ matches }),
  setLastResults: (results) => set({ lastResults: results }),
  setRanking: (ranking) => set({ ranking }),
}));
