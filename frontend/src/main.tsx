import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TranslationProvider } from './context/TranslationContext.tsx'
import { ProfileProvider } from './context/ProfilContext.tsx'
import { TournamentProvider } from './context/ResultsContext.tsx'
import { ModeProvider } from "../src/context/ModeContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfileProvider>
    <TranslationProvider>
      <TournamentProvider>
        <ModeProvider>
        <App />
        </ModeProvider>
      </TournamentProvider>
    </TranslationProvider>
    </ProfileProvider>
  </StrictMode> 
)