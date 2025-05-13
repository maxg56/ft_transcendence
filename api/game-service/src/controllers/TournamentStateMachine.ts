import { Tournament } from "./Tournament"; 

type Phase = 'WAITING' | 'SEMIS' | 'FINALS' | 'FINISHED';
type Event = 'START' | 'MATCH_FINISHED';

class TournamentStateMachine {
  private phase: Phase = 'WAITING';

  constructor(private tournament: Tournament) {}

  getPhase(): Phase {
    return this.phase;
  }

  transition(event: Event) {
    switch (this.phase) {
      case 'WAITING':
        if (event === 'START') {
          this.phase = 'SEMIS';
          this.tournament.setupSemis();
        }
        break;
      case 'SEMIS':
        if (event === 'MATCH_FINISHED' && this.tournament.areMatchesFinished(['Game1', 'Game2'])) {
          this.phase = 'FINALS';
          this.tournament.setupFinals();
        }
        break;
      case 'FINALS':
        if (event === 'MATCH_FINISHED' && this.tournament.areMatchesFinished(['final', 'third'])) {
          this.phase = 'FINISHED';
          this.tournament.finishTournament();
        }
        break;
    }
  }
}

export { TournamentStateMachine };