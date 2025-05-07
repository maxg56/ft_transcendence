import { useState } from 'react';

type Mode = "1 vs 1" | "2 vs 2" | `${'friends' | 'tournois'}-join:${string}` | `${'friends' | 'tournois'}-create`;

type Props = {
      onSelect: (value: Mode) => void;
      onClose: () => void;
    };

export default function TournamentPopup({ onSelect, onClose }: Props) {
  const [mode, setMode] = useState<'friends' | 'tournois'>('friends');
  const [code, setCode] = useState('');

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
                ? 'bg-blue-500/80'
                : 'bg-blue-300/40 hover:bg-blue-400/60'
            }`}
            onClick={() => null}
          >
            Friends
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold transition shadow-md ${
              mode === 'tournois'
                ? 'bg-green-500/80'
                : 'bg-green-300/40 hover:bg-green-400/60'
            }`}
            onClick={() => null}
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
              onSelect(`${mode}-join:${code}`);
              onClose();
            }}
          >
            Join
          </button>
          <button
            className="px-4 py-2 rounded-md font-semibold bg-yellow-500/70 hover:bg-yellow-600/80 transition shadow-md"
            onClick={() => {
              onSelect(`${mode}-create`);
              onClose();
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
