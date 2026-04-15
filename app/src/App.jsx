import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ProjectPage from './pages/ProjectPage'
import SiteFooter from './components/SiteFooter'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <p
          className="font-mono uppercase"
          style={{
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.1em',
            color: 'var(--color-text-tertiary)',
          }}
        >
          Chargement…
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function ConditionalFooter() {
  const location = useLocation()
  // Hide footer on ProjectPage (full-tool workspace with its own chrome)
  if (location.pathname.startsWith('/project/')) return null
  return <SiteFooter />
}

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ConditionalFooter />
    </>
  )
}

export default App
