import { PlayerSide, room,GameMode } from '../type';
import { Player } from '../models/Player';
import { GameEngine , GameEngine1v1} from './GameEngine';

type phase = 'WAITING' | 'SEMIS' | 'FINALS' | 'FINISHED';
class Tournament {
    private nd_players: number = 0;
    private players: Player[] = [];
    private TournGames = new Map<string, room>();
    private phase: phase = 'WAITING';
    
    constructor(nd_players : number = 4) {
      this.nd_players = nd_players;
    }
    
    addPlayer(player: Player): boolean {
      if (this.players.length >= this.nd_players) return false;
      this.players.push(player);
      if (this.players.length === this.nd_players) this.startTournament();
      return true;
    }
    
    private startTournament() {
      this.phase = 'SEMIS';
      const [p1, p2, p3, p4] = this.players;
    
      this.createMatch('semi1', [p1, p4]);
      this.createMatch('semi2', [p2, p3]);
  
      this.broadcast('🏁 Tournament started! Semi-finals created.');
    }
  
    private createMatch(id: string, players: Player[]) {
      const engine = new GameEngine1v1("1v1");
      const timer = setTimeout(() => {
        ; // Start automatically after 5s
      }, 5000);
  
      const match: room = {
        players,
        engine,
        autoStartTimer: timer,
        mode: 'tournament',
        isPrivateGame: false,
        isPongGame: true,
        startTime: new Date()
      };
  
      this.TournGames.set(id, match);
    }
  
    recordResult(roomId: string, winnerId: string) {
      const match = this.TournGames.get(roomId);
      if (!match) return;
  
      const winner = match.players.find(p => p.id === winnerId);
      if (!winner) return;
  
      // Stocker dans le GameEngine ou ailleurs ?
      (match.engine as any).winner = winner;
  
      if (this.phase === 'SEMIS') {
        const s1 = this.TournGames.get('semi1');
        const s2 = this.TournGames.get('semi2');
  
        if (s1?.engine['winner'] && s2?.engine['winner']) {
          this.startFinals(s1.engine['winner'], s2.engine['winner'], s1, s2);
        }
      } else if (this.phase === 'FINALS') {
        const final = this.TournGames.get('final');
        const third = this.TournGames.get('third');
  
        if (final?.engine['winner'] && third?.engine['winner']) {
          this.phase = 'FINISHED';
          this.broadcast('🏆 Tournament finished!');
        }
      }
    }
  
    private startFinals(finalist1: Player, finalist2: Player, semi1: room, semi2: room) {
      this.phase = 'FINALS';
  
      const loser1 = semi1.players.find(p => p.id !== finalist1.id)!;
      const loser2 = semi2.players.find(p => p.id !== finalist2.id)!;
  
      this.createMatch('final', [finalist1, finalist2]);
      this.createMatch('third', [loser1, loser2]);
  
      this.broadcast('🔥 Finals and third-place match created!');
    }
  
    private broadcast(message: string) {
      for (const player of this.players) {
        player.ws.send(JSON.stringify({ event: 'tournament_update', message }));
      }
    }
  
    getTournamentState() {
      return {
        phase: this.phase,
        matches: Array.from(this.TournGames.entries())
      };
    }
  }
  