import React from "react";
import { Send, Mail } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  setOpen: (open: boolean) => void;
  open: boolean;
}

const buttonStyle =
  "p-2 text-white font-semibold rounded-md text-glow bg-gradient-to-r " +
  "from-cyan-600/60 to-purple-600/60 border border-cyan-500/60 " +
  "shadow-[0_0_10px_rgba(0,255,255,0.4)] hover:shadow-[0_0_10px_rgba(0,255,255,0.8)] " +
  "transition duration-300";

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  setOpen,
  open,
}) => {
  const { t } = useTranslation();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSend();
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t w-full absolute bottom-0 bg-white/5 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className={buttonStyle}
        title={open ? t("Fermer la boîte mail") : t("Ouvrir la boîte mail")}
      >
        <Mail size={20} />
      </button>
      <input
        className="flex-1 border border-cyan-500/40 rounded-md p-2 text-sm text-white bg-transparent placeholder:text-cyan-200 focus:outline-none"
        type="text"
        placeholder={t("Écrire un message...")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={onSend}
        className={buttonStyle}
        title={t("Envoyer")}
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default ChatInput;
