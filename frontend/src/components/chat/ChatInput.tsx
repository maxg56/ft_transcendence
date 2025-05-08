import React from "react";
import {Send , Mail} from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  setOpen: (open: boolean) => void;
  open: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, setOpen, open }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSend();
  };

  return (
    <div className="p-3 border-t flex gap-2">
      <button onClick={() => setOpen(!open)} className="px-3 py-1 bg-blue-500 text-white text-sm rounded-2xl hover:bg-blue-600 relative">
        <Mail/>
      </button>
      <input
        className="flex-1 border rounded-md p-2 text-sm"
        type="text"
        placeholder="Écrire un message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={onSend}
        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
      >
       <Send/>
      </button>
    </div>
  );
};

export default ChatInput;
