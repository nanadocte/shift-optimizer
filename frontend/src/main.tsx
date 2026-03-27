import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/assets/style/index.css'
import Auth from './features/auth/authPage/Auth.tsx'
import Dashboard from './features/dashobard/dashboardPage/Dashboard.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  </StrictMode>
)
