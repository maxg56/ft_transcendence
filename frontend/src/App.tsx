import React, {useState, useEffect} from 'react';
import './App.css';
import Accueil from './pages/Accueil';
import Hub from './pages/Hub'
import Duel from './pages/Duel';
import Duel2 from './pages/Duel2';
import Profile from './pages/Profil'
import useNavigation from "./hooks/useNavigation";
import MultiplayerSelection from './pages/MultiplayerSelection';
import PlayersGame4 from './pages/Players4Game';
import TournamentT1 from './pages/TournamentT1';
import TournamentT2 from './pages/TournamentT2';
import Modeduel from './components/ChooseGame';
import Results from './pages/Results';
import { WebSocketProvider } from './context/WebSocketContext';


const App: React.FC = () => {
  const { path } = useNavigation();
  const [currentPath, setCurrentPath] = useState(path);

  useEffect(() => {
    setCurrentPath(path); // 🔥 Met à jour l'état quand path change
  }, [path]);

  return (
    <WebSocketProvider>
    <div key={currentPath}> {/* 🔥 Forcer un re-render */}
      {currentPath === "/" && <Accueil />}
      {currentPath === "/hub" && <Hub />}
      {currentPath === "/profile" && <Profile />}
      {currentPath === "/duel" && <Duel />}
      {currentPath === "/duel2" && <Duel2 />}
      {currentPath === "/multiplayerselect" && <MultiplayerSelection />}
      {currentPath === "/playersgame4" && <PlayersGame4 />}
      {currentPath === "/tournamentStage1" && <TournamentT1 />}
      {currentPath === "/tournamentStage2" && <TournamentT2 />}
      {currentPath === "/modeduel" && <Modeduel />}
      {currentPath === "/results" && <Results />}
    </div>
    </WebSocketProvider>
  );
};

export default App;
