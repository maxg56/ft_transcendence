import MultiPopup from "./MultiPopup";
import { useTranslation } from "@/context/TranslationContext";
import { useMode , Mode } from "@/context/ModeContext";

type MultiButtonProps = {
  isOpen: boolean,
  open: () => void;
  close: () => void;
};

export default function MultiButton({ isOpen, open, close }: MultiButtonProps) {
  const { t } = useTranslation();
  const { setMode } = useMode();

  const handleSelect = (choice : Mode) => {
    setMode(choice);
    close();
  };

  return (
    <>
      <button
        className="text-glow px-40 py-2 top-[10%] px-40 py-2  rounded-md text-white font-semibold 
             bg-gradient-to-r from-cyan-400/60 via-blue-500/60 to-purple-600/60 
             backdrop-blur-md 
             shadow-[0_0_20px_rgba(0,255,255,0.4)] 
             hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] 
             border border-cyan-300/30 
             transition duration-300"
        onClick={() => open()}
      >
        {t("Multi")}
      </button>
      {isOpen && (
        <MultiPopup
          onSelect={handleSelect}
          onClose={close}
        />
      )}
    </>
  );
}
