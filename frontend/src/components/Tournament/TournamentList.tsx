type Player = {
	id: number;
	name: string;
	avatar: string;
	username: string;
};

type ParticipantsListProps = {
	players: Player[];
};

const ParticipantsList = ({ players }: ParticipantsListProps) => {
	return (
		<div className="mt-6 text-center">
			<h3 className="text-md font-semibold mb-2">Participants :</h3>
			<div className="flex justify-center gap-4 flex-wrap">
				{players.length === 0 ? (
					<span className="text-gray-500 italic">En attente de joueurs...</span>
				) : (
					players.map(player => (
						<div
							key={player.id}
							className="flex flex-col items-center bg-white shadow rounded p-3"
						>
							<img
								src={`https://robohash.org/${player.username}`}
								alt={player.username}
								className="w-12 h-12 rounded-full mb-1 object-cover"
							/>
							<span className="text-sm font-medium">{player.name}</span>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default ParticipantsList