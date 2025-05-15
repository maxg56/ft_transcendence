import React from 'react';
import {Routes, Route } from 'react-router-dom';
import './App.css';
import Accueil from './pages/Accueil';
import  AuthGuard  from '@/_halper/AuthGuard';
import AppRouter  from '@/pages/appRouter';
import {WebSocketProvider} from './context/WebSocketContext';
import { ProfileProvider } from "./context/ProfilContext"

  const App: React.FC = () => {
    return (
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/*" element={
          <AuthGuard>
            <ProfileProvider userId={0}>
              {/* <ProfileProvider> */}
              <WebSocketProvider>
                  <AppRouter />
              </WebSocketProvider>
            </ProfileProvider>
          </AuthGuard>
        } />
      </Routes>
    );
  };

export default App;
