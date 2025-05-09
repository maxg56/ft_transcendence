import { Routes, Route } from 'react-router-dom';

import Solo from '@/pages/game/Solo';
import Hub from '@/pages/Hub';
import Duel2 from '@/pages/game/Duel';
import Profile from '@/pages/Profil';
import WaitingRoom from '@/pages/WaitingRoom';
import MultiplayerSelection from '@/pages/MultiplayerSelection';
import PlayersGame4 from '@/pages/game/Players4Game';
import WRTournament from '@/pages/Tournament/WRTournament';
import TournamentT2 from '@/pages/Tournament/TournamentT2';
import Modeduel from '@/components/ChooseGame';
import Results from '@/pages/Tournament/Results';
import NotFound from '@/pages/NotFound';
import Game4Players from '@/pages/game/Player4WSGame';
import Duel3 from '@/pages/game/DuelWS';

const AppRouter = () => {
    return (
        <Routes >
            <Route path="/solo" element={<Solo />} />
            <Route path="/hub" element={<Hub />} />
            <Route path="/WaitingRoom" element={<WaitingRoom />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/duel2" element={<Duel2 />} />
            <Route path="/duel3" element={<Duel3 />} />
            <Route path="/wsGame" element={<Game4Players />} />
            <Route path="/multiplayerselect" element={<MultiplayerSelection />} />
            <Route path="/playersgame4" element={<PlayersGame4 />} />
            <Route path="/waitingroomtournament" element={<WRTournament />} />
            <Route path="/tournamentStage2" element={<TournamentT2 />} />
            <Route path="/modeduel" element={<Modeduel />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRouter;
