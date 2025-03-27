import React, {useState, useEffect} from 'react';
import './App.css';
import Accueil from './pages/Accueil';
import Hub from './pages/Hub'
import Duel from './pages/Duel';
import Profile from './pages/Profil'
import useNavigation from "./hooks/useNavigation";

const App: React.FC = () => {
  const { path } = useNavigation();
  const [currentPath, setCurrentPath] = useState(path);

  useEffect(() => {
    setCurrentPath(path); // 🔥 Met à jour l'état quand path change
  }, [path]);

  return (
    <div key={currentPath}> {/* 🔥 Forcer un re-render */}
      {currentPath === "/" && <Accueil />}
      {currentPath === "/hub" && <Hub />}
      {currentPath === "/profile" && <Profile />}
      {currentPath === "/duel" && <Duel />}
    </div>
  );
};

export default App;
