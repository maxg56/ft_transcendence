// import React, { createContext, useContext, useEffect, useState } from 'react';

// type KeyboardContextType = {
//   pressedKeys: Set<string>;
//   simulateKeyPress: (key: string) => void;
//   simulateKeyRelease: (key: string) => void;
// };

// const KeyboardContext = createContext<KeyboardContextType>({
//   pressedKeys: new Set(),
//   simulateKeyPress: () => {},
//   simulateKeyRelease: () => {}
// });

// export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       setPressedKeys(prev => new Set(prev).add(e.key));
//     };

//     const handleKeyUp = (e: KeyboardEvent) => {
//       setPressedKeys(prev => {
//         const updated = new Set(prev);
//         updated.delete(e.key);
//         return updated;
//       });
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   // NEW: simulate key press (for AI)
//   const simulateKeyPress = (key: string) => {
//     setPressedKeys(prev => {
//       const updated = new Set(prev);
//       updated.add(key);
//       return updated;
//     });
//   };

//   // NEW: simulate key release (for AI)
//   const simulateKeyRelease = (key: string) => {
//     setPressedKeys(prev => {
//       const updated = new Set(prev);
//       updated.delete(key);
//       return updated;
//     });
//   };

//   return (
//     <KeyboardContext.Provider value={{ pressedKeys, simulateKeyPress, simulateKeyRelease }}>
//       {children}
//     </KeyboardContext.Provider>
//   );
// };

// export const useKeyboard = () => useContext(KeyboardContext);
