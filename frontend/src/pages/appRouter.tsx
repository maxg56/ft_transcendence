import { Routes, Route } from 'react-router-dom';

import Solo from '@/pages/Solo';
import Hub from '@/pages/Hub';
import Duel2 from '@/pages/Duel2';
import Profile from '@/pages/Profil';
import WaitingRoom from '@/pages/WaitingRoom';
import MultiplayerSelection from '@/pages/MultiplayerSelection';
import PlayersGame4 from '@/pages/Players4Game';
import TournamentT1 from '@/pages/TournamentT1';
import TournamentT2 from '@/pages/TournamentT2';
import Modeduel from '@/components/ChooseGame';
import Results from '@/pages/Results';
import NotFound from '@/pages/NotFound';


const AppRouter = () => {
    return (
        <Routes >
            <Route path="/solo" element={<Solo />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="/WaitingRoom" element={<WaitingRoom />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/duel2" element={<Duel2 />} />
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
