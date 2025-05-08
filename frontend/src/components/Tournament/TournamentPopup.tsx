import { useState } from 'react';
import useNavigation from '@/hooks/useNavigation';

type Mode = "1 vs 1" | "2 vs 2" | `${'friends' | 'tournois'}-join:${string}` | `${'friends' | 'tournois'}-create`;

type Props = {
      onSelect: (value: Mode) => void;
      onClose: () => void;
    };

export default function TournamentPopup({ onClose }: Props) {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'friends' | 'tournois'>('friends');
  const {navigate} = useNavigation();

  return (
    <div
      className="absolute top-[450%] left-[43%] -translate-x-1/2 fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-cyan-400/40 via-blue-500/40 to-purple-600/40 
                   backdrop-blur-md border border-cyan-300/30 
                   shadow-[0_0_30px_rgba(0,255,255,0.3)] 
                   rounded-2xl p-6 flex flex-col gap-4 min-w-[300px] text-white text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md font-semibold transition shadow-md ${
              mode === 'friends'
              ? 'bg-blue-600'
              : 'bg-blue-300 hover:bg-blue-400'
            }`}
            onClick={() => setMode('friends')}
            >
            Friends
          </button>
          <button
          className={`px-4 py-2 rounded-md font-semibold transition shadow-md ${
              mode === 'tournois'
              ? 'bg-green-600'
              : 'bg-green-300 hover:bg-green-400'
              }`}
              onClick={() => setMode('tournois')}
            >
            Tournois
          </button>
      </div>


        {/* Input */}
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter Code"
          className="px-4 py-2 rounded-md text-black focus:outline-none"
        />

        {/* Join / Create */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-4 py-2 rounded-md font-semibold bg-purple-500/70 hover:bg-purple-600/80 transition shadow-md"
            onClick={() => {
              onClose();
              if (mode === 'tournois') {
                navigate("/waitingroomtournament");
              }
            }}
          >
            Join
          </button>
          <button
            className="px-4 py-2 rounded-md font-semibold bg-yellow-500/70 hover:bg-yellow-600/80 transition shadow-md"
            onClick={() => {
              onClose();
              if (mode === 'tournois') {
                navigate("/waitingroomtournament");
              }
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
