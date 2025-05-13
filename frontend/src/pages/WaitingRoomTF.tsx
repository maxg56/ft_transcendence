import TournamentCode from '@/components/Tournament/TournamentCode';
import ParticipantsList from '@/components/Tournament/TournamentList';
import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';



const WaitingRoomTF = () => {
  const { code, players ,isTournament} = useWaitroomListener();

  return (
    <div className="scale-95">
    <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 flex flex-col">
      {/* CRT Scanline Sweep */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
          </div>
      <div className="text-center mb-8 text-white">
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
    </div>
  );
};

export default WaitingRoomTF;