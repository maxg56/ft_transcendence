import { Mode } from "@/context/ModeContext";
import { useTranslation } from "@/context/TranslationContext";

type Props = {
  onSelect: (value: Mode) => void;
  onClose: () => void;
};

export default function MultiPopup({ onSelect, onClose }: Props) {
  const { t } = useTranslation();

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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl hover:text-red-400 transition"
          aria-label="Close popup"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-2">{t("Select Mode")}</h2>

        <button
          className="px-4 py-2 rounded-md font-semibold 
                     bg-blue-500/70 hover:bg-blue-600/80 
                     backdrop-blur-sm transition shadow-md"
          onClick={() => { onSelect("1 vs 1"); onClose(); }}
        >
          1 vs 1
        </button>

        <button
          className="px-4 py-2 rounded-md font-semibold 
                     bg-green-500/70 hover:bg-green-600/80 
                     backdrop-blur-sm transition shadow-md"
          onClick={() => { onSelect("2 vs 2"); onClose(); }}
        >
          2 vs 2
        </button>
      </div>
    </div>
  );
}


