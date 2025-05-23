import { Tournament } from "./Tournament"; 

type Phase = 'WAITING' | 'SEMIS' | 'FINALS' | 'FINISHED';
type Event = 'WAITING' | 'START' | 'MATCH_FINISHED';

class TournamentStateMachine {
  private phase: Phase = 'WAITING';

  constructor(private tournament: Tournament) {}

  getPhase(): Phase {
    return this.phase;
  }

  transition(event: Event) {
    switch (this.phase) {
      case 'WAITING':
        if (event === 'WAITING') {
          this.phase = 'WAITING';
        }
        if (event === 'START') {
          this.phase = 'SEMIS';
        }
        break;
      case 'SEMIS':
        if (event === 'MATCH_FINISHED' && this.tournament.areMatchesFinished(['Game1', 'Game2'])) {
          this.phase = 'FINALS';
        }
        break;
      case 'FINALS':
        if (event === 'MATCH_FINISHED' && this.tournament.areMatchesFinished(['final', 'third'])) {
          this.phase = 'FINISHED';
        }
        break;
    }
  }
}

export { TournamentStateMachine };