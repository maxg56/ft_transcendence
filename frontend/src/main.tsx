import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TranslationProvider } from './context/TranslationContext.tsx'
import { ProfileProvider } from './context/ProfilContext.tsx'
import { TournamentProvider } from './context/ResultsContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfileProvider>
    <TranslationProvider>
      <TournamentProvider>
        <App />
      </TournamentProvider>
    </TranslationProvider>
    </ProfileProvider>
  </StrictMode> 
)