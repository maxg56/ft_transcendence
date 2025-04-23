import React, { createContext, useContext, useEffect, useState } from 'react';

type KeyboardContextType = {
  pressedKeys: Set<string>;
};

const KeyboardContext = createContext<KeyboardContextType>({ pressedKeys: new Set() });

export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => new Set(prev).add(e.key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const updated = new Set(prev);
        updated.delete(e.key);
        return updated;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <KeyboardContext.Provider value={{ pressedKeys }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => useContext(KeyboardContext);
