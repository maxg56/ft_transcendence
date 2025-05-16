import { useState } from 'react';
import {create_private_game ,join_private_game ,join_tournament_game} from "@/hooks/WedSooket/useJoinQueue";
import { toast } from "sonner";
import { useTranslation } from "@/context/TranslationContext";

type Mode = "1 vs 1" | "2 vs 2" | `${'friends' | 'tournois'}-join:${string}` | `${'friends' | 'tournois'}-create`;

type Props = {
      onSelect: (value: Mode) => void;
      onClose: () => void;
    };
export default function TournamentPopup({ onClose, onSelect }: Props) {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'friends' | 'tournois'>('friends');
  const { createPrivateGame} = create_private_game();
  const { joinPrivateGame } = join_private_game();
  const { joinTournament } = join_tournament_game();
  const { t } = useTranslation();

  const handleJoin = () => {
    if (!code.trim()) {
      toast.error(t("Please enter a code"));
      return;
    }
    onSelect(`${mode}-join:${code}`);
    onClose();
    if (mode === 'tournois') {
      joinTournament(code, "/waitingroomPrivategame");
    }
    else {
      joinPrivateGame(code, "/waitingroomPrivategame");
    }
  };

  const handleCreate = () => {
    onSelect(`${mode}-create`);
    onClose();
    if (mode === 'tournois') {
      createPrivateGame("/waitingroomPrivategame", 4, true);
    } else {
      createPrivateGame("/waitingroomPrivategame", 2, false);
    }
  };

  return (
    <div
      className="absolute top-[350%] left-[43%] -translate-x-1/2 fixed  z-50 flex items-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
  <div
    className="bg-gradient-to-br from-cyan-400/40 via-blue-500/40 to-purple-600/40 
                   backdrop-blur-md border border-cyan-300/30 
                   shadow-[0_0_30px_rgba(0,255,255,0.3)] 
                   rounded-2xl p-8 flex flex-col gap-4 min-w-[300px] text-white text-center"
               onClick={(e) => e.stopPropagation()}
  >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl hover:text-red-400 transition"
          aria-label="Close popup"
        >
          ✕
        </button>
    {/* Toggle Buttons */}
    <div className="flex justify-center gap-2 sm:gap-4 mb-4 flex-wrap">
      <button
        className={`px-10 py-2 rounded-md font-semibold text-sm sm:text-base transition shadow-md ${
          mode === 'friends' ? 'bg-blue-600' : 'bg-blue-300 hover:bg-blue-400'
        }`}
        onClick={() => setMode('friends')}
      >
        {t("Friends")}
      </button>
      <button
        className={`px-2 py-2 rounded-md font-semibold text-sm sm:text-base transition shadow-md ${
          mode === 'tournois' ? 'bg-green-600' : 'bg-green-300 hover:bg-green-400'
        }`}
        onClick={() => setMode('tournois')}
      >
        {t("Tournois")}
      </button>
    </div>

    {/* Input */}
    <div className="flex justify-center gap-2 sm:gap-4 mt-4 flex-wrap">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={t("Enter Code")}
        className="w-[40%] sm:w-[295px] max-w-full border border-cyan-500/40 
                   rounded-md p-2 text-xl text-center text-white bg-transparent 
                   placeholder:text-cyan-200 focus:outline-none 
                   transition duration-300 ease-in-out"
      />
    </div>


    {/* Join / Create */}
    <div className="flex justify-center gap-2 sm:gap-4 mt-4 flex-wrap">
      <button
        className="px-8 py-2 rounded-md font-semibold bg-purple-500/70 hover:bg-purple-600/80 text-sm sm:text-base transition shadow-md"
        onClick={handleJoin}
      >
        {t("Join")}
      </button>
      <button
        className="px-6 py-2 rounded-md font-semibold bg-yellow-500/70 hover:bg-yellow-600/80 text-sm sm:text-base transition shadow-md"
        onClick={handleCreate}
      >
        {t("Create")}
      </button>
    </div>
  </div>
</div>

  );
}
