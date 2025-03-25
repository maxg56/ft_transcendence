import React, {useState, useEffect} from 'react';
import './App.css';
import Accueil from './pages/Accueil';
import Hub from './pages/Hub'
import useNavigation from "./hooks/useNavigation";

const App: React.FC = () => {
  const { path } = useNavigation();
  const [currentPath, setCurrentPath] = useState(path);

  useEffect(() => {
    console.log("🔄 Mise à jour de currentPath :", path);
    setCurrentPath(path); // 🔥 Met à jour l'état quand path change
  }, [path]);

  return (
    <div key={currentPath}> {/* 🔥 Forcer un re-render */}
      {currentPath === "/" && <Accueil />}
      {currentPath === "/hub" && <Hub />}
    </div>
  );
};

export default App;
