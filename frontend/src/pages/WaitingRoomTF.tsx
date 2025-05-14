import TournamentCode from '@/components/Tournament/TournamentCode';
import ParticipantsList from '@/components/Tournament/TournamentList';
import { useWaitroomListener } from '@/hooks/WedSooket/userWsWR';
import { useTranslation } from "@/context/TranslationContext";
import Chat from "@/components/chat/Chat";

const WaitingRoomTF = () => {
  const { code, players, isTournament } = useWaitroomListener();
  const { t } = useTranslation();
  return (
    <div className="scale-95">
      <div className="crt w-screen h-screen rounded-[150px] padding-[10px] overflow-hidden bg-gray-900 ">
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="w-full h-full absolute top-[-100%] scanline-glow" />
          </div>
      <div className="flex justify-center items-center w-full h-[929px] overflow-hidden">
          <video
            className="absolute top-10 left-0 w-screen h-screen object-cover z-0 scale-15"
            src="/videos/black_hole.mp4"
            autoPlay
            loop
            muted
            playsInline
        />
      </div>
      <div className=" absolute bottom-[28%] left-[75%]">
        <Chat/>
      </div>
      <div className="title text-center text-white z-20 absolute bottom-[18%] left-1/2 -translate-x-1/2 
                px-20 py-10 flex flex-col justify-center items-center
               rounded-[2vw]
                bg-gradient-to-r from-cyan-400/20 via-blue-500/20 
                backdrop-blur-md
                shadow-[0_0_20px_rgba(0,255,255,0.4)] ">
      <div className="mb-2 text-sm py-5">
        <span className="font-semibold text-xl">{t("Code du tournoi :")}</span>
          <TournamentCode code={code} />
      </div>
      <div className="text-sm ">
        <span className="font-semibold">{t("Joueurs connectés :")}</span>
      </div>
      <ParticipantsList players={players} code={code} isTournament={isTournament} />
      {/* <Chat/> */}
      </div>
      <div className="title text-glow px-40 py-2 px-40 py-2 rounded-md text-white font-semibold 
             bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-yellow-600/60 
             backdrop-blur-md 
             shadow-[0_0_20px_rgba(0,255,255,0.4)] 
             hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
             border border-cyan-300/30 
             transition duration-300 z-10">
          <h1>{t("Salle d'attente Tournoi")}</h1>
      </div>
      </div>
    </div>
  );
};

export default WaitingRoomTF;

