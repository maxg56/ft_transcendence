import { create } from "zustand";

export type Player = {
  isHost: boolean;
  username: string;
  avatar: string | null;
};

type Match = any; // tu peux le typer mieux si tu veux
type Result = any;
type Ranking = {id : string; name: string}[]; // ou un autre type selon tes besoins

type WaitroomState = {
  code: string;
  tournamentId: string;
  players: Player[];
  isTournament: boolean;
  tournamentStatus: string;
  matches: Match[];
  lastResults: Result[];
  ranking: Ranking[];
  isHost: boolean;

  setCode: (code: string) => void;
  setTournamentId: (id: string) => void;
  setIsHost: (is: boolean) => void;
  setPlayers: (players: Player[]) => void;
  setIsTournament: (is: boolean) => void;
  setTournamentStatus: (status: string) => void;
  setMatches: (matches: Match[]) => void;
  setLastResults: (results: Result[]) => void;
  setRanking: (ranking: Ranking[]) => void;
};

export const useWaitroomStore = create<WaitroomState>((set) => ({
  code: "",
  tournamentId: "",
  isHost: false,
  players: [],
  isTournament: false,
  tournamentStatus: "",
  matches: [],
  lastResults: [],
  ranking: [],

  setCode: (code) => set({ code }),
  setTournamentId: (id) => set({ tournamentId: id }),
  setIsHost: (is) => set({ isHost: is }),
  setPlayers: (players) => set({ players }),
  setIsTournament: (is) => set({ isTournament: is }),
  setTournamentStatus: (status) => set({ tournamentStatus: status }),
  setMatches: (matches) => set({ matches }),
  setLastResults: (results) => set({ lastResults: results }),
  setRanking: (ranking) => set({ ranking }),
}));
