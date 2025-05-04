import React, { useRef, useState } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

type KeyInputProps = {
  value: string;
  onChange: (key: string) => void;
};

const KeyInput: React.FC<KeyInputProps> = ({value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const renderValue = () => {
    if (value === "ArrowUp") return <ArrowUp className="w-5 h-5" />;
    if (value === "ArrowDown") return <ArrowDown className="w-5 h-5" />;
    if (value === "ArrowLeft") return <ArrowLeft className="w-5 h-5" />;
    if (value === "ArrowRight") return <ArrowRight className="w-5 h-5" />;
    return <span className="text-xl">{value}</span>;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    const forbiddenKeys = ["Shift", "Alt", "Meta", "Control"];
    if (!forbiddenKeys.includes(e.key)) {
      onChange(e.key);
      setIsFocused(false);
    }
  };

  return (
    <div
      className={`relative w-12 h-12 flex items-center justify-center border rounded bg-white text-center cursor-pointer hover:bg-gray-100 ${
        isFocused ? "border-blue-500" : "border-gray-400"
      }`}
      onClick={() => {
        setIsFocused(true);
        inputRef.current?.focus();
      }}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute inset-0 opacity-0"
        onKeyDown={handleKeyDown}
        onBlur={() => setIsFocused(false)}
      />
      <div className={`transition-opacity ${isFocused ? "opacity-50" : "opacity-100"}`}>
        {isFocused ? <span className="text-xs text-gray-500"> </span> : renderValue()}
      </div>
    </div>
  );
};

export default KeyInput;
