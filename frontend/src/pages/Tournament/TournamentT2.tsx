import React, { useState, useEffect } from 'react';
import useNavigation from "../../hooks/useNavigation";
import { useTournament } from '../../context/ResultsContext';

type Player = { id: number; name: string };

type Match = {
	id: number;
	player1?: Player;
	player2?: Player;
	score1?: number;
	score2?: number;
	winner?: Player;
	loser?: Player;
};

const TournamentT2: React.FC = () => {
	const { results: initialResults, setResults } = useTournament();
	const { navigate } = useNavigation();

	const [matches, setMatches] = useState<Match[]>(() =>
		initialResults.slice(0, 2).map(m => ({
			...m,
			score1: m.score1 ?? 0,
			score2: m.score2 ?? 0,
			winner: m.winner,
			loser: m.loser
		}))
	);

	const [newMatches, setNewMatches] = useState<Match[]>([{ id: 3 }, { id: 4 }]);

	useEffect(() => {
		const winners = matches.map(m => m.winner).filter(Boolean) as Player[];
		const losers = matches.map(m => m.loser).filter(Boolean) as Player[];

		if (winners.length === 2 && losers.length === 2) {
			setNewMatches([
				{ id: 3, player1: winners[0], player2: winners[1] },
				{ id: 4, player1: losers[0], player2: losers[1] }
			]);
		}
	}, [matches]);

	const handleScoreChange = (
		matchId: number,
		player: 'player1' | 'player2',
		value: string
	) => {
		const updater = (m: Match) => {
			const up = { ...m };
			if (player === 'player1') up.score1 = Number(value);
			else up.score2 = Number(value);

			if (
				up.score1 !== undefined &&
				up.score2 !== undefined &&
				!isNaN(up.score1) &&
				!isNaN(up.score2)
			) {
				if (up.score1 > up.score2) {
					up.winner = up.player1;
					up.loser = up.player2;
				} else {
					up.winner = up.player2;
					up.loser = up.player1;
				}
			}
			return up;
		};

		if (matchId <= 2) {
			setMatches(prev => prev.map(m => m.id === matchId ? updater(m) : m));
		} else {
			setNewMatches(prev => prev.map(m => m.id === matchId ? updater(m) : m));
		}
	};

	const renderMatch = (m: Match, disabled = false) => (
		<div key={m.id} className="bg-white p-6 rounded-lg shadow w-72 text-lg">
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<input
						type="number"
						className="w-16 border rounded p-2"
						value={m.score1 ?? ''}
						onChange={e => handleScoreChange(m.id, 'player1', e.target.value)}
						disabled={disabled}
					/>
					<span className="flex-1">{m.player1?.name || '?'}</span>
				</div>
				<div className="h-px bg-gray-200" />
				<div className="flex items-center gap-2">
					<input
						type="number"
						className="w-16 border rounded p-2"
						value={m.score2 ?? ''}
						onChange={e => handleScoreChange(m.id, 'player2', e.target.value)}
						disabled={disabled}
					/>
					<span className="flex-1">{m.player2?.name || '?'}</span>
				</div>
				{m.winner && (
					<div className="mt-2 text-green-600">
						Vainqueur : {m.winner.name}
					</div>
				)}
			</div>
		</div>
	);

  const handleNext = () => {
    const simulatedFinals = newMatches.map(match => {
      const score1 = Math.floor(Math.random() * 11);
      const score2 = Math.floor(Math.random() * 11);
      const winner = score1 > score2 ? match.player1 : match.player2;
      const loser  = score1 > score2 ? match.player2 : match.player1;
  
      return { ...match, score1, score2, winner, loser };
    });
  
    setNewMatches(simulatedFinals);
  
    const allMatches = [...matches, ...simulatedFinals];
    setResults(allMatches);
    navigate("/results");
  };

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="space-y-16">
				<section>
					<h2 className="text-center font-semibold mb-4">Demi-finales</h2>
					<div className="flex justify-center gap-8">
						{matches.map(m => renderMatch(m, true /* désactive les inputs */))}
					</div>
				</section>

				<section>
					<h2 className="text-center font-semibold mb-4">Finales</h2>
					<div className="flex justify-center gap-8">
						{newMatches.map(m => renderMatch(m))}
					</div>
				</section>
			</div>

			<div className="flex justify-center mt-12">
				<button
					onClick={handleNext}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default TournamentT2;
