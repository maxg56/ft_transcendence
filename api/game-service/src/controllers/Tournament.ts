// Tournament.ts
import { PlayerSide, Room, GameMode } from '../type';
import { Player } from '../models/Player';
import { GameEngine1v1 } from './GameEngine/game-engine-1v1';
import { activeGames } from '../config/data';
import { startGameLoop } from './gameLoop';
import { PlayerSide1v1, GameScore1v1 } from '../type';
import { TournamentStateMachine } from './TournamentStateMachine';

interface Match {
  match: string;
  player1: string;
  player2: string;
  score: { player1: number, player2: number };
}

interface WsTournament {
  matches: Match[];
  matchResults: Match[];
}


class Tournament {
  private ackWaiters: Record<string, { resolve: () => void, timeout: NodeJS.Timeout }> = {};
  private lastStep: string | null = null;
  public hostId: string | null = null;
  private players: Player[] = [];
  private TournGames = new Map<string, Room>();
  private completedMatches: Match[] = [];
  private stateMachine = new TournamentStateMachine(this);

  constructor(players: Player[]) {
    this.players = players;
    if (players.length > 0) this.hostId = players[0].id; // convention : host = premier joueur
    this.stateMachine.transition('START');
  }

  async setupSemis() {
    const [p1, p2, p3, p4] = this.players;
    this.createMatch('Game1', [p1, p4]);
    this.createMatch('Game2', [p2, p3]);
    this.broadcast('🏁 Tournament started! Semi-finals created.');
    await this.waitForAck('tournament_update');
    this.broadcastWsTournament();
  }

  async setupFinals() {
    const s1 = this.TournGames.get('Game1')!;
    const s2 = this.TournGames.get('Game2')!;
    const winner1 = this.getWinner(s1);
    const winner2 = this.getWinner(s2);
    const loser1 = s1.players.find(p => p.id !== winner1.id)!;
    const loser2 = s2.players.find(p => p.id !== winner2.id)!;

    this.createMatch('final', [winner1, winner2]);
    this.createMatch('third', [loser1, loser2]);
    this.broadcast('🔥 Finals and third-place match created!');
    await this.waitForAck('tournament_update');
    this.broadcastWsTournament();
  }

  async finishTournament() {
    const final = this.TournGames.get('final')!;
    const third = this.TournGames.get('third')!;
    const winner = this.getWinner(final);
    const winner2 = this.getWinner(third);
    const runnerUp = final.players.find(p => p.id !== winner.id)!;
    const fourth = third.players.find(p => p.id !== winner2.id)!;

    const standings = [
      { position: 1, player: winner.name },
      { position: 2, player: runnerUp.name },
      { position: 3, player: winner2.name },
      { position: 4, player: fourth.name },
    ];

    this.broadcast({ event: 'tournament_end', data: standings });
    await this.waitForAck('tournament_end');
  }

  areMatchesFinished(ids: string[]): boolean {
    return ids.every(id => {
      const room = this.TournGames.get(id);
      return room?.engine.getGameState().winner !== null;
    });
  }

  private getWinner(room: Room): Player {
    const state = room.engine.getGameState();
    return state.winner === 'left' ? room.players[0] : room.players[1];
  }

  private createMatch(id: string, players: Player[]) {
    const engine = new GameEngine1v1("1v1", (winnerSide: PlayerSide1v1, score: GameScore1v1) => {
      this.recordResult(id, winnerSide, score);
    });

    const teamsMap = new Map(players.map((p, i) => [i, [p]] as [number, Player[]]));
    const match: Room = {
      players,
      teams: teamsMap,
      engine,
      autoStartTimer: null,
      mode: '1v1' as GameMode,
      isPrivateGame: false,
      isPongGame: true,
      startTime: new Date(),
      isTournament: true
    };

    this.TournGames.set(id, match);
    activeGames.set(id, match);
    console.log("Match created", id);
    // notify clients of match found
    const teamsResponse = players.map((p, i) => ({ id: i + 1, players: [{ id: p.id, name: p.name }] }));
    
    this.startGame(id, 10000);
    players.forEach((p, idx) => {
      p.ws.send(JSON.stringify({
        event: 'match_found',
        data: {
          gameId: id,
          format: { teams: 2, playersPerTeam: 1 },
          teamId: idx + 1,
          positionInTeam: 0,
          teams: teamsResponse
        }
      }));
    });
  }

  /**
   * Starts a tournament game after an optional delay (default 0ms)
   */
  private startGame(id: string, delay: number = 0) {
    if (delay > 0) {
      setTimeout(() => {
        startGameLoop(id);
      }, delay);
    } else {
      startGameLoop(id);
    }
  }

  

  private async recordResult(roomId: string, winnerSide: PlayerSide1v1, score: GameScore1v1) {
    const match = this.TournGames.get(roomId);
    if (!match) return;

    const teamIndex = winnerSide === 'left' ? 0 : 1;
    const winners = match.teams.get(teamIndex)!;

    this.broadcast({ event: 'tournament_match_result', data: { roomId, winners: winners.map(p => p.name), score } });
    await this.waitForAck('tournament_match_result');

    const finished: Match = {
      match: roomId,
      player1: match.players[0].name,
      player2: match.players[1].name,
      score: { player1: score.left, player2: score.right }
    };

    this.completedMatches.push(finished);
    this.broadcastWsTournament();
    this.stateMachine.transition('MATCH_FINISHED');
  }

  private broadcast<T>(message: T) {
    const payload = typeof message === 'string' ? { event: 'tournament_notification', data: message } : message;
    const data = JSON.stringify(payload);
    for (const player of this.players) {
      player.ws.send(data);
    }
  }

  private broadcastWsTournament() {
    const wsData: WsTournament = {
      matches: Array.from(this.TournGames.entries()).map(([id, room]) => {
        const state = room.engine.getGameState();
        return {
          match: id,
          player1: room.players[0].name,
          player2: room.players[1].name,
          score: { player1: state.score.left, player2: state.score.right }
        };
      }),
      matchResults: this.completedMatches
    };
    for (const player of this.players) {
      player.ws.send(JSON.stringify({ event: 'tournament_update', data: wsData }));
    }
    // On attend ack après le broadcast
    this.waitForAck('tournament_update');
  }

  getTournamentState() {
    return {
      matches: Array.from(this.TournGames.entries())
    };
  }

  // Nouvelle logique d'attente d'ack
  async waitForAck(step: string) {
    if (this.ackWaiters[step]) return; // déjà en attente
    this.lastStep = step;
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        delete this.ackWaiters[step];
        // Optionnel : relancer ou annuler
        // reject(new Error('Timeout ack'));
      }, 8000);
      this.ackWaiters[step] = { resolve: () => {
        clearTimeout(timeout);
        delete this.ackWaiters[step];
        resolve();
      }, timeout };
    });
  }

  receiveAck(step: string, player: Player) {
    if (player.id !== this.hostId) return;
    if (this.ackWaiters[step]) {
      this.ackWaiters[step].resolve();
      // Envoie ack_ok à l'host
      const host = this.players.find(p => p.id === this.hostId);
      if (host && host.ws && host.ws.readyState === 1) {
        host.ws.send(JSON.stringify({ event: 'ack_ok', step }));
      }
    }
  }

  getHostId() {
    return this.hostId;
  }
}

export { Tournament };