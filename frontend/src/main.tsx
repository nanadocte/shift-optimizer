import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/assets/style/index.css'
import Auth from './features/auth/authPage/Auth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth />
  </StrictMode>
)
