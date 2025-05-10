import { Player } from '../models/Player';

function calculateElo(players: Player[], winnerIds: string[], baseK = 32): Player[] {
  const totalPlayers = players.length;
  const K = baseK / Math.log2(totalPlayers);
  const updatedPlayers = players.map((player) => ({ ...player }));

  const probabilities = new Map<string, number>();

  for (const player of players) {
    let expected = 0;
    for (const opponent of players) {
      if (player.id === opponent.id) continue;

      const expectedScore = 1 / (1 + Math.pow(10, (opponent.elo - player.elo) / 400));
      expected += expectedScore;
    }

    probabilities.set(player.id, expected / (totalPlayers - 1)); // moyenne
  }

  for (const player of updatedPlayers) {
    const actualScore = winnerIds.includes(player.id) ? 1 : 0;
    const expectedScore = probabilities.get(player.id) ?? 0;
    player.elo = Math.round(player.elo + K * (actualScore - expectedScore));
  }

  return updatedPlayers;
}

export default calculateElo;
