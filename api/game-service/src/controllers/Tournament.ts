
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
  private lastStep: string | null = null;
  public hostId: string | null = null;
  private players: Player[] = [];
  private TournGames = new Map<string, Room>();
  private completedMatches: Match[] = [];
  private stateMachine = new TournamentStateMachine(this);
  public id: string;

  constructor(players: Player[], id: string) {
    this.id = id;
    this.players = players;
    if (players.length > 0) this.hostId = players[0].id;
    this.stateMachine.transition('START');
    this.initializeSemis();
  }

  private initializeSemis() {
    const [p1, p2, p3, p4] = this.players;
    this.createMatch('Game1', [p1, p4]);
    this.createMatch('Game2', [p2, p3]);
    this.broadcastWsTournament();
  }

  public async setupSemis() {
    this.broadcast('🏁 Tournament started! Semi-finals créées.');
    this.startGame('Game1', 7000);
    this.startGame('Game2', 7000);
  }

  public async startFinales() {
    this.broadcast('🔥 Finales et match pour la 3e place créés !');
    this.startGame('final', 7000);
    this.startGame('third', 7000);
  }

  public async setupFinals() {
    const s1 = this.TournGames.get('Game1');
    const s2 = this.TournGames.get('Game2');
    if (!s1 || !s2) return console.error('[Tournament] setupFinals: missing semi-final rooms');

    const winner1 = this.getWinner(s1);
    const winner2 = this.getWinner(s2);
    if (!winner1 || !winner2) return console.error('[Tournament] setupFinals: missing winners', { winner1, winner2 });

    const loser1 = s1.players.find(p => p.id !== winner1.id)!;
    const loser2 = s2.players.find(p => p.id !== winner2.id)!;

    this.TournGames.delete('Game1');
    this.TournGames.delete('Game2');
    this.createMatch('final', [winner1, winner2]);
    this.createMatch('third', [loser1, loser2]);
    this.broadcastWsTournament();
  }

  public async finishTournament() {
    console.log('[Tournament] finishTournament - TournGames keys:', Array.from(this.TournGames.keys()));

    const final = this.TournGames.get('final');
    const third = this.TournGames.get('third');
    if (!final || !third) return console.error('[Tournament] finishTournament: final or third room not found');

    const winner = this.getWinner(final);
    const thirdPlaceWinner = this.getWinner(third);
    if (!winner || !thirdPlaceWinner) return console.error('[Tournament] finishTournament: missing winners');

    const runnerUp = final.players.find(p => p.id !== winner.id)!;
    const fourth = third.players.find(p => p.id !== thirdPlaceWinner.id)!;

    const standings = [
      { position: 1, player: winner.name },
      { position: 2, player: runnerUp.name },
      { position: 3, player: thirdPlaceWinner.name },
      { position: 4, player: fourth.name },
    ];

    this.broadcast({ event: 'tournament_end', data: standings });
  }

  private getWinner(room: Room | string): Player | null {
    const match = typeof room === 'string' ? this.TournGames.get(room) : room;
    if (!match) return console.error(`[Tournament] getWinner: Room not found for id`, room), null;

    const state = match.engine.getGameState();
    return state.winner === 'left' ? match.players[0] : match.players[1];
  }

  public areMatchesFinished(ids: string[]): boolean {
    return ids.every(id => {
      const room = this.TournGames.get(id);
      return room?.engine.getGameState().winner !== null;
    });
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
  }

  private startGame(id: string, delay: number = 0) {
    if (!this.players.length) return console.error('No players available to start the game.');

    const match = this.TournGames.get(id);
    const teamsResponse = match
      ? Array.from(match.teams.entries()).map(([teamId, players]) => ({
          id: teamId + 1,
          players: players.map(pl => ({ id: pl.id, name: pl.name }))
        }))
      : [];

    if (!match) return console.error('Match not found for id', id);
    Array.from(match.teams.entries()).forEach(([teamId, players]) => {
      players.forEach((p, pos) => {
        if (p.ws?.send) {
          p.ws.send(JSON.stringify({
            event: 'match_found',
            data: {
              gameId: id,
              format: { teams: 2, playersPerTeam: 1 },
              teamId: teamId + 1,
              positionInTeam: pos,
              teams: teamsResponse
            }
          }));
        }
      });
    });

    delay > 0 ? setTimeout(() => startGameLoop(id), delay) : startGameLoop(id);
  }

  private async recordResult(roomId: string, winnerSide: PlayerSide1v1, score: GameScore1v1) {
    const match = this.TournGames.get(roomId);
    if (!match) return;

    const teamIndex = winnerSide === 'left' ? 0 : 1;
    const winners = match.teams.get(teamIndex)!;

    const resultMsg = {
      event: 'tournament_match_result',
      data: { roomId, winners: winners.map(p => p.name), score }
    };
    match.players.forEach(player => player.ws.send(JSON.stringify(resultMsg)));

    this.completedMatches.push({
      match: roomId,
      player1: match.players[0].name,
      player2: match.players[1].name,
      score: { player1: score.left, player2: score.right }
    });

    const phase = this.stateMachine.getPhase();
    const matchGroups = {
      SEMIS: ['Game1', 'Game2'],
      FINALS: ['final', 'third']
    };

    if ((phase === 'SEMIS' || phase === 'FINALS') && this.areMatchesFinished(matchGroups[phase])) {
      if (phase === 'SEMIS') await this.setupFinals();
      if (phase === 'FINALS') await this.finishTournament();
      this.stateMachine.transition('MATCH_FINISHED');
    } else {
      this.broadcastWsTournament();
      this.stateMachine.transition('MATCH_FINISHED');
    }
  }

  private broadcast<T>(message: T) {
    const payload = typeof message === 'string'
      ? { event: 'tournament_notification', data: message }
      : message;
    const data = JSON.stringify(payload);
    this.players.forEach(player => player.ws.send(data));
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

    this.players.forEach(player => player.ws.send(JSON.stringify({ event: 'tournament_update', data: wsData })));
  }

  public getTournamentState() {
    return {
      matches: Array.from(this.TournGames.entries())
    };
  }

  public getHostId() {
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
        this.stateMachine.transition('START');
        break;
      case 'SEMIS':
        await this.setupSemis();
        break;
      case 'FINALS':
        await this.startFinales();
        console.log('[Tournament] Finishing tournament...');
        break;
      case 'FINISHED':
        console.log('[Tournament] Tournament already finished.');
        break;
      default:
        console.error('[Tournament] No next step available for phase:', phase);
        throw new Error('No next step available');
    }
  }
}

export { Tournament };

