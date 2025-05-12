import { useState } from 'react';
import TournamentCode from '@/components/Tournament/TournamentCode';
import ParticipantsList from '@/components/Tournament/TournamentList';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '@/context/ResultsContext';

type Player = {
	isHost?: boolean;
	name: string;
	username: string;
	avatar: string;
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
	const {setResults} = useTournament();
	const navigate = useNavigate();
	const [players] = useState<Player[]>([
		{
			isHost: true,
			name: 'Joueur 1',
			username: 'joueur1',
			avatar: `https://robohash.org/joueur1`
		},
		{
			isHost: false,
			name: 'Joueur 2',
			username: 'joueur2',
			avatar: `https://robohash.org/joueur2`
		},
		{
			isHost: false,
			name: 'Joueur 3',
			username: 'joueur3',
			avatar: `https://robohash.org/joueur3`
		},
		{
			isHost: false,
			name: 'Joueur 4',
			username: 'joueur4',
			avatar: `https://robohash.org/joueur4`
		}
	]);
		
	const [matches, setMatches] = useState<Match[]>([
		{ id: 1, player1: players[0], player2: players[1] },
		{ id: 2, player1: players[2], player2: players[3] }
	]);


	const simulateAndGoToNext = () => {
		const simulatedMatches = matches.map(match => {
			const score1 = Math.floor(Math.random() * 11);
			const score2 = Math.floor(Math.random() * 11);
			const winner = score1 > score2 ? match.player1 : match.player2;
			const loser = score1 > score2 ? match.player2 : match.player1;
	
			return {
				...match,
				score1,
				score2,
				winner,
				loser
			};
		});
	
		setMatches(simulatedMatches);
		setTimeout(() => {
			navigate('/tournamentStage2 ');
		}, 300);
	};
	

	const renderMatch = (match: Match) => (
		<div key={match.id} className="flex mb-8">
			<div className="bg-white p-6 rounded-lg shadow-lg w-72 z-10 relative text-lg space-y-2">
				<div className="flex items-center gap-2">
					<input
						type="number"
						className="w-16 border rounded p-2 text-lg"
						value={match.score1 ?? ''}
						// onChange={e => handleScoreChange(match.id, 'player1', e.target.value)}
					/>
					<span className="flex-1 truncate">{match.player1?.name || '?'}</span>
				</div>

				<div className="h-px bg-gray-200" />

				<div className="flex items-center gap-2">
					<input
						type="number"
						className="w-16 border rounded p-2 text-lg"
						value={match.score2 ?? ''}
						// onChange={e => handleScoreChange(match.id, 'player2', e.target.value)}
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


	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="flex justify-center gap-16">
				<div className="flex flex-col gap-16">
					<h2 className="text-lg font-semibold text-center">Matchs à venir</h2>
					<div className="flex flex-row gap-8">{matches.map(renderMatch)}</div>
				</div>
			</div>
		</div>
	);
};

export default TournamentT1;