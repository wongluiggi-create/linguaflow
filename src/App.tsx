import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { useAuth } from './hooks/useAuth'
import { useProgressSync } from './hooks/useProgressSync'
import { useAppStore } from './store/useAppStore'
import { isFirebaseConfigured } from './lib/firebase'
import Login from './pages/Login'
import PlacementTest from './pages/PlacementTest'
import Dashboard from './pages/Dashboard'
import CurriculumView from './pages/CurriculumView'
import VocabularyModule from './pages/VocabularyModule'
import GrammarModule from './pages/GrammarModule'
import ListeningModule from './pages/ListeningModule'
import ReadingModule from './pages/ReadingModule'
import SpeakingModule from './pages/SpeakingModule'
import AIChatModule from './pages/AIChatModule'

function Spinner() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid var(--faint)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function AppRoutes() {
  useProgressSync()
  const { isAuthenticated, screen } = useAppStore()

  const inApp = isAuthenticated || screen === 'app'
  // When Firebase is not configured, skip login and go straight to placement
  const loginTarget = isFirebaseConfigured ? '/login' : '/placement'

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={inApp ? '/app/dashboard' : loginTarget} replace />} />

      {/* Auth / onboarding */}
      <Route path="/login" element={
        inApp ? <Navigate to="/app/dashboard" replace /> :
        !isFirebaseConfigured ? <Navigate to="/placement" replace /> :
        <Login />
      } />
      <Route path="/placement" element={inApp ? <Navigate to="/app/dashboard" replace /> : <PlacementTest />} />

      {/* Protected app */}
      <Route path="/app" element={inApp ? <AppShell /> : <Navigate to="/login" replace />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="curriculum" element={<CurriculumView />} />
        <Route path="vocabulary" element={<VocabularyModule />} />
        <Route path="grammar" element={<GrammarModule />} />
        <Route path="listening" element={<ListeningModule />} />
        <Route path="reading" element={<ReadingModule />} />
        <Route path="speaking" element={<SpeakingModule />} />
        <Route path="chat" element={<AIChatModule />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const { loading } = useAuth()

  if (loading) return <Spinner />

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
