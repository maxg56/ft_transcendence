import TournamentCode from '@/components/Tournament/TournamentCode';
import ParticipantsList from '@/components/Tournament/TournamentList';
import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';



const WaitingRoomTF = () => {
  const { code, players ,isTournament} = useWaitroomListener();

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Salle d'attente Tournoi</h2>
        <div className="mb-4">
          <span className="font-semibold">Code du tournoi :</span>
          <TournamentCode code={code} />
        </div>
        <div className="mb-2">
          <span className="font-semibold">Joueurs connectés :</span>
        </div>
        <ParticipantsList players={players} code={code} isTournament={isTournament} />
      </div>
    </div>
  );
};

export default WaitingRoomTF;