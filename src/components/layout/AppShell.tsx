import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { XPBar } from '../ui/XPBar'
import { CURRICULUM } from '../../data/curriculum'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Inicio', icon: '🏠', path: '/app/dashboard' },
  { id: 'curriculum', label: 'Currículo', icon: '📚', path: '/app/curriculum' },
  { id: 'vocabulary', label: 'Vocab', icon: '📖', path: '/app/vocabulary' },
  { id: 'grammar', label: 'Gramática', icon: '✏️', path: '/app/grammar' },
  { id: 'listening', label: 'Audio', icon: '🎧', path: '/app/listening' },
  { id: 'reading', label: 'Lectura', icon: '📰', path: '/app/reading' },
  { id: 'speaking', label: 'Speaking', icon: '🗣️', path: '/app/speaking' },
  { id: 'chat', label: 'AI', icon: '🤖', path: '/app/chat' },
]

const XP_PER_LEVEL = 300

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentLevel, xp, streak, completedCourses } = useAppStore()

  const levelData = CURRICULUM.find((l) => l.id === currentLevel)
  const totalCourses = levelData?.courses.length ?? 0
  const completedCount = levelData?.courses.filter((c) => completedCourses[c.id]).length ?? 0

  const xpLevel = Math.floor(xp / XP_PER_LEVEL) + 1
  const xpInLevel = xp % XP_PER_LEVEL

  const activeTab = NAV_ITEMS.find((n) => location.pathname.startsWith(n.path))?.id ?? 'dashboard'

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        color: 'var(--text)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* Logo */}
        <span
          style={{
            fontWeight: 800,
            fontSize: 18,
            background: 'linear-gradient(135deg, var(--accent), var(--sky))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
            flexShrink: 0,
          }}
        >
          LinguaFlow
        </span>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Lv.N · done/total */}
          <span style={{ color: 'var(--muted)', fontSize: 11, whiteSpace: 'nowrap' }}>
            Lv.{xpLevel} · {completedCount}/{totalCourses}
          </span>

          {/* Streak */}
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', whiteSpace: 'nowrap' }}>
            🔥 {streak}
          </span>

          {/* Mini XP bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
              {xpInLevel}/{XP_PER_LEVEL} XP
            </span>
            <div style={{ width: 72 }}>
              <XPBar value={xpInLevel} max={XP_PER_LEVEL} color={levelData?.color} />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.25rem 88px' }}>
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          background: 'rgba(19, 23, 40, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '6px 0',
          zIndex: 50,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '4px 6px',
                borderRadius: 8,
                color: isActive ? 'var(--accent)' : 'var(--muted)',
                transition: 'color 0.15s',
              }}
            >
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, letterSpacing: '0.02em' }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
