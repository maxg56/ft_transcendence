import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Player = { id: number; name: string };
export type Match = {
  id: number;
  player1?: Player;
  player2?: Player;
  score1?: number;
  score2?: number;
  winner?: Player;
  loser?: Player;
};

interface TournamentContextType {
  results: Match[];
  setResults: (m: Match[]) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export const TournamentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [results, setResults] = useState<Match[]>([]);
  return (
    <TournamentContext.Provider value={{ results, setResults }}>
      {children}
    </TournamentContext.Provider>
  );
};

export function useTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx) throw new Error("useTournament must be used within TournamentProvider");
  return ctx;
}
