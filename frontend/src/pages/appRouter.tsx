import { Routes, Route } from 'react-router-dom';

import Solo from '@/pages/game/Solo';
import Hub from '@/pages/Hub';
import Duel2 from '@/pages/game/Duel';
import Profile from '@/pages/Profil';
import WaitingRoom from '@/pages/WaitingRoom';
import MultiplayerSelection from '@/pages/MultiplayerSelection';
import PlayersGame4 from '@/pages/game/Players4Game';
import TournamentT1 from '@/pages/Tournament/TournamentT1';
import TournamentT2 from '@/pages/Tournament/TournamentT2';
import Modeduel from '@/components/ChooseGame';
import Results from '@/pages/Results';
import NotFound from '@/pages/NotFound';
import DuelComponent from '@/pages/game/DuelWS';


const AppRouter = () => {
    return (
        <Routes >
            <Route path="/solo" element={<Solo />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="/WaitingRoom" element={<WaitingRoom />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/duel2" element={<Duel2 />} />
            <Route path="/duel3" element={<DuelComponent />} />
            <Route path="/multiplayerselect" element={<MultiplayerSelection />} />
            <Route path="/playersgame4" element={<PlayersGame4 />} />
            <Route path="/tournamentStage1" element={<TournamentT1 />} />
            <Route path="/tournamentStage2" element={<TournamentT2 />} />
            <Route path="/modeduel" element={<Modeduel />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;
