import React, { useRef, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

type KeyInputProps = {
  keyName: string;
  value: string;
  onChange: (key: string) => void;
};

const KeyInput: React.FC<KeyInputProps> = ({ keyName, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const renderValue = () => {
    if (value === "ArrowUp") return <ArrowUp className="w-5 h-5" />;
    if (value === "ArrowDown") return <ArrowDown className="w-5 h-5" />;
    return <span className="text-xl">{value}</span>;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    onChange(e.key);
    setIsFocused(false);
  };

  return (
    <div
      className="relative w-12 h-12 flex items-center justify-center border border-gray-400 rounded bg-white text-center cursor-pointer hover:bg-gray-100"
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
      <div className={`${isFocused ? "opacity-0" : "opacity-100"} transition-opacity`}>
        {renderValue()}
      </div>
    </div>
  );
};

export default KeyInput;
