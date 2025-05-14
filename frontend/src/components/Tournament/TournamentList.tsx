import { Player } from '@/types/WF';
import PlayerCircle from './PlayerCircle';
import { useWebSocket } from '@/context/WebSocketContext';
import { useTranslation } from '@/context/TranslationContext';

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
  const { t } = useTranslation();

  return (
    <div className="mt-6 text-center relative">
      <h3 className="text-md font-semibold mb-2">{t("Participants :")}</h3>
      
      {/* Conteneur des joueurs */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
        {/* Bouton Start */}
        <button
          onClick={handleStart}
          disabled={players.every((player) => player.isHost === false)}
          className="text-glow absolute p-3 text-white rounded-md z-10 font-semibold 
                     bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-purple-600/60 
                    backdrop-blur-md 
                    shadow-[0_0_20px_rgba(0,255,255,0.4)] 
                    border border-cyan-300/30 "
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
