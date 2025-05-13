import { Player } from '@/types/WF';
import PlayerCircle from './PlayerCircle';
import { useWebSocket } from '@/context/WebSocketContext';

type ParticipantsListProps = {
  players: Player[];
  code: string;
  isTournament: boolean;
};

const ParticipantsList = ({ players, code ,isTournament}: ParticipantsListProps) => {
  const { sendMessage } = useWebSocket();
  const handleStart = () => {
    if (!isTournament) {
      sendMessage(JSON.stringify({ event: 'state_private_game', data: { gameCode: code } }));
    }
    else {
      sendMessage(JSON.stringify({ event: 'tournament_state', data: { gameCode: code } }));
    }
  };

  return (
    <div className="mt-6 text-center relative">
      <h3 className="text-md font-semibold mb-2">Participants :</h3>
      
      {/* Conteneur des joueurs */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        {/* Bouton Start */}
        <button
          onClick={handleStart}
          disabled={players.every((player) => player.isHost === false)}
          className="absolute p-3 bg-blue-500 text-white rounded-full z-10"
        >
          Start
        </button>

        {/* Liste des joueurs en cercle */}
        {players.map((player, index) => (
          <PlayerCircle key={player.username} player={player} index={index} total={players.length} />
        ))}

      </div>
    </div>
  );
};

export default ParticipantsList;
