import TournamentCode from '@/components/Tournament/TournamentCode';
import ParticipantsList from '@/components/Tournament/TournamentList';
import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';

const WaitingRoomTF = () => {
  const { code, players, isTournament } = useWaitroomListener();

  return (
    <div className="scale-95">
      <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 ">
      <div className="absolute top-0 left-0 w-full h-full">
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
          </div>
      <div className="text-center mb-8 text-white z-20title absolute bottom-[10%] left-1/2 -translate-x-1/2 
                       px-20 py-10 rounded-md text-white font-semibold 
                        bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 
                        backdrop-blur-md
                        shadow-[0_0_20px_rgba(0,255,255,0.4)] 
                        hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
                        border border-cyan-300/30 
                        transition duration-300">
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

