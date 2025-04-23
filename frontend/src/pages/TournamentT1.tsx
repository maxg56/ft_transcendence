import React, { useState } from 'react';
import useNavigation from "../hooks/useNavigation";
import { useTournament } from '../context/ResultsContext';

type Player = {
	id: number;
	name: string;
};

type Match = {
	id: number;
	player1?: Player;
	player2?: Player;
	score1?: number;
	score2?: number;
	winner?: Player;
	loser?: Player;
};

const TournamentT1 = () => {
	const [players] = useState<Player[]>([
		{ id: 1, name: 'Joueur 1' },
		{ id: 2, name: 'Joueur 2' },
		{ id: 3, name: 'Joueur 3' },
		{ id: 4, name: 'Joueur 4' }
	]);

	const [matches, setMatches] = useState<Match[]>([
		{ id: 1, player1: players[0], player2: players[1] },
		{ id: 2, player1: players[2], player2: players[3] }
	]);

	const { setResults } = useTournament();
	const { navigate } = useNavigation();

	const handleScoreChange = (matchId: number, player: 'player1' | 'player2', value: string) => {
		setMatches(prev =>
			prev.map(match => {
				if (match.id !== matchId) return match;

				const updated = { ...match };
				if (player === 'player1') updated.score1 = Number(value);
				else updated.score2 = Number(value);

				if (
					updated.score1 !== undefined &&
					updated.score2 !== undefined &&
					!isNaN(updated.score1) &&
					!isNaN(updated.score2)
				) {
					if (updated.score1 > updated.score2) {
						updated.winner = updated.player1;
						updated.loser = updated.player2;
					} else {
						updated.winner = updated.player2;
						updated.loser = updated.player1;
					}
				}
				return updated;
			})
		);
	};

	const renderMatch = (match: Match) => (
		<div key={match.id} className="flex mb-8">
			<div className="bg-white p-6 rounded-lg shadow-lg w-72 z-10 relative text-lg space-y-2">
				<div className="flex items-center gap-2">
					<input
						type="number"
						className="w-16 border rounded p-2 text-lg"
						value={match.score1 ?? ''}
						onChange={e => handleScoreChange(match.id, 'player1', e.target.value)}
					/>
					<span className="flex-1 truncate">{match.player1?.name || '?'}</span>
				</div>

				<div className="h-px bg-gray-200" />

				<div className="flex items-center gap-2">
					<input
						type="number"
						className="w-16 border rounded p-2 text-lg"
						value={match.score2 ?? ''}
						onChange={e => handleScoreChange(match.id, 'player2', e.target.value)}
					/>
					<span className="flex-1 truncate">{match.player2?.name || '?'}</span>
				</div>

				{match.winner && (
					<div className="mt-2 text-xs text-green-600 font-medium">
						Vainqueur : {match.winner.name}
					</div>
				)}
			</div>
		</div>
	);

	const handleNext = () => {
		setResults(matches);
		navigate("/tournamentStage2");
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="flex justify-center gap-16">
				<div className="flex flex-col gap-16">
					<h2 className="text-lg font-semibold text-center">Matchs à venir</h2>
					<div className="flex flex-row gap-8">{matches.map(renderMatch)}</div>
				</div>
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

export default TournamentT1;