import  MatchPlayer  from './MatchPlayer';

export type MatchPlayerWithUser = MatchPlayer & {
	player: {
	  username: string;
	};
  };