// Tournament.ts
import { PlayerSide, Room, GameMode } from '../type';
import { Player } from '../models/Player';
import { GameEngine1v1 } from './GameEngine/game-engine-1v1';
import { activeGames } from '../config/data';
import { startGameLoop } from './gameLoop';
import { PlayerSide1v1, GameScore1v1 } from '../type';
import { TournamentStateMachine } from './TournamentStateMachine';
import { v4 as uuidv4 } from 'uuid';

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
  private id: string;

  constructor(players: Player[] , id: string) {
    this.id = id;
    this.players = players;
    if (players.length > 0) this.hostId = players[0].id;
    this.stateMachine.transition('WAITING');
    const [p1, p2, p3, p4] = this.players;
    this.createMatch('Game1'+ this.id, [p1, p4]);
    this.createMatch('Game2'+ this.id, [p2, p3]);
    this.broadcastWsTournament();
  }

  /**
   * Sets up the semi-finals and starts the games
   */
  async setupSemis() {
    this.broadcast('🏁 Tournament started! Semi-finals créées.');
    this.startGame('Game1'+this.id, 10000);
    this.startGame('Game2'+this.id, 10000);
  }

  /**
   * Starts the tournament and creates the finals and third place match
   */
  async startTournament() {
    this.broadcast('🔥 Finales et match pour la 3e place créés !');;
    this.startGame('final'+this.id, 10000);
    this.startGame('third'+this.id, 10000);
  }

  /**
   * Sets up the finals and starts the games
   */
  async setupFinals() {
    const s1 = this.TournGames.get('Game1' + this.id);
    const s2 = this.TournGames.get('Game2' + this.id);
    if (!s1 || !s2) {
      console.error('[Tournament] setupFinals: missing semi-final rooms');
      return;
    }
    const winner1 = this.getWinner(s1);
    const winner2 = this.getWinner(s2);
    if (!winner1 || !winner2) {
      console.error('[Tournament] setupFinals: missing winners', { winner1, winner2 });
      return;
    }
    const loser1 = s1.players.find(p => p.id !== winner1.id)!;
    const loser2 = s2.players.find(p => p.id !== winner2.id)!;

    this.createMatch('final'+this.id, [winner1, winner2]);
    this.createMatch('third'+this.id, [loser1, loser2]);
    this.broadcastWsTournament();
  }


  /**
   * Finishes the tournament and returns the standings
   */
  async finishTournament() {
    // Log les clés de TournGames pour debug
    console.log('[Tournament] finishTournament - TournGames keys:', Array.from(this.TournGames.keys()));

    const final = this.TournGames.get('final'+this.id);
    const third = this.TournGames.get('third'+this.id);
    if (!final || !third) {
      console.error('[Tournament] finishTournament: final or third room not found', { final, third });
      return;
    }
    const winner = this.getWinner(final);
    const winner2 = this.getWinner(third);
    if (!winner || !winner2) {
      console.error('[Tournament] finishTournament: missing winners', { winner, winner2 });
      return;
    }
    const runnerUp = final.players.find(p => p.id !== winner.id)!;
    const fourth = third.players.find(p => p.id !== winner2.id)!;

    const standings = [
      { position: 1, player: winner.name },
      { position: 2, player: runnerUp.name },
      { position: 3, player: winner2.name },
      { position: 4, player: fourth.name },
    ];

    this.broadcast({ event: 'tournament_end', data: standings });
  }

  /**
   * Returns true if all matches are finished
   */
  areMatchesFinished(ids: string[]): boolean {
    return ids.every(id => {
      const room = this.TournGames.get(id);
      return room?.engine.getGameState().winner !== null;
    });
  }

  /**
   * Returns the winner of a match
   */
  private getWinner(room: Room | string): Player | null {
    const match = typeof room === 'string' ? this.TournGames.get(room) : room;
    if (!match) {
      console.error(`[Tournament] getWinner: Room not found for id`, room);
      return null;
    }
    const state = match.engine.getGameState();
    return state.winner === 'left' ? match.players[0] : match.players[1];
  }

  /**
   * Creates a match and notify players
   */
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
    
  }

  /**
   * Starts a tournament game after an optional delay (default 0ms)
   */
  private startGame(id: string, delay: number = 0) {
  if (!this.players || this.players.length === 0) {
    console.error('No players available to start the game.');
    return;
  }
  const teamsResponse = this.players.map((p, i) => ({
    id: i + 1,
    players: [{ id: p.id, name: p.name }]
  }));

  this.players.forEach((p, idx) => {
    if (p.ws && typeof p.ws.send === 'function') {
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
    }
  });

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

    // Message de fin de match envoyé uniquement aux joueurs du match
    const matchPlayers = match.players;
    const resultMsg = { event: 'tournament_match_result', data: { roomId, winners: winners.map(p => p.name), score } };
    for (const player of matchPlayers) {
      player.ws.send(JSON.stringify(resultMsg));
    }

    const finished: Match = {
      match: roomId,
      player1: match.players[0].name,
      player2: match.players[1].name,
      score: { player1: score.left, player2: score.right }
    };

    this.completedMatches.push(finished);

    // Vérifie si les deux demi-finales ou finales sont terminées
    const phase = this.stateMachine.getPhase();
    if (phase === 'SEMIS') {
      const semisIds = ['Game1' + this.id, 'Game2' + this.id];
      if (this.areMatchesFinished(semisIds)) {
        await this.setupFinals();
        this.stateMachine.transition('MATCH_FINISHED');
        this.broadcastWsTournament(); // Broadcast la nouvelle phase à tous
        return;
      }
    } else if (phase === 'FINALS') {
      const finalsIds = ['final' + this.id, 'third' + this.id];
      if (this.areMatchesFinished(finalsIds)) {
        await this.finishTournament();
        this.stateMachine.transition('MATCH_FINISHED');
        // Le classement final est déjà broadcast dans finishTournament
        return;
      }
    }

    this.broadcastWsTournament(); // Sinon, broadcast normal
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
      matches: Array.from(this.TournGames.entries())
        .map(([id, room]) => {
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
  }
  getTournamentState() {
    return {
      matches: Array.from(this.TournGames.entries())
    };
  }



  getHostId() {
    return this.hostId;
  }

  /**
   * Permet au host de démarrer explicitement la prochaine étape du tournoi.
   */
  public async startNextStep() {
    const phase = this.stateMachine.getPhase();
    console.log(`[Tournament] startNextStep called, current phase: ${phase}`);
    switch (phase) {
      case 'WAITING':
        console.log('[Tournament] Setting up semis...');
        await this.setupSemis();
        this.stateMachine.transition('START');
        break;
      case 'SEMIS':
        console.log('[Tournament] Setting up finals...');
        await this.startTournament();
        this.stateMachine.transition('MATCH_FINISHED');
        break;
      default:
        console.error('[Tournament] No next step available for phase:', phase);
        throw new Error('No next step available');
    }
  }
}

export { Tournament };