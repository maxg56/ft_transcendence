import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { TranslationProvider } from './context/TranslationContext.tsx'
import { TournamentProvider } from './context/ResultsContext.tsx'
import { ModeProvider } from "../src/context/ModeContext";
import { Toaster } from "@/components/ui/sonner"
import { ConfKeyProvider } from './context/ConfKeyContext.tsx'
import { LogoutProvider } from './hooks/useLogOut.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
    <TranslationProvider>
      <TournamentProvider>
        <ModeProvider>
          <ConfKeyProvider>
            <LogoutProvider>
              <App />
            </LogoutProvider>
            <Toaster />
          </ConfKeyProvider>
        </ModeProvider>
      </TournamentProvider>
    </TranslationProvider>
  </BrowserRouter>
  </StrictMode> 
)