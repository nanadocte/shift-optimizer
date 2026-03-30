import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/assets/style/index.css'
import Auth from './features/auth/authPage/Auth.tsx'
import Dashboard from './features/dashobard/dashboardPage/Dashboard.tsx'
import Nav from './features/dashobard/components/users/Nav.tsx'
import Employees from './features/employees/employeesPage/Employees.tsx'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Nav />}>
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          {/* <Route path="/planning" element={<Planning />} /> */}
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AnimatedRoutes />
    </Router>
  </StrictMode>
)
