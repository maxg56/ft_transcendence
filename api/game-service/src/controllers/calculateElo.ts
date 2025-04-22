import { Player } from '../models/Player';

function calculateElo(players: Player[], winnerIds: string[], baseK: number = 32): Player[] {
  const totalPlayers = players.length;
  const K = baseK / Math.log2(totalPlayers);
  const updatedPlayers = players.map((player) => ({ ...player }));

  // Compute probability of each player winning
  const probabilities = new Map<string, number>();

  for (const player of players) {
    let sum = 0;
    for (const opponent of players) {
      if (player.id !== opponent.id) {
        sum += Math.pow(10, (opponent.elo - player.elo) / 400);
      }
    }
    probabilities.set(player.id, sum === 0 ? 0 : 1 / sum);
  }

  // Update Elo ratings
  for (const player of updatedPlayers) {
    const expectedScore = probabilities.get(player.id) || 0;
    const actualScore = winnerIds.includes(player.id) ? 1 : 0;
    player.elo = Math.round(player.elo + K * (actualScore - expectedScore));
  }

  return updatedPlayers;
}

export default calculateElo;
