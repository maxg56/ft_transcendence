import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TranslationProvider } from './context/TranslationContext.tsx'
import { ProfileProvider } from './context/ProfilContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfileProvider>
    <TranslationProvider>
      <App />
    </TranslationProvider>
    </ProfileProvider>
  </StrictMode>
)
