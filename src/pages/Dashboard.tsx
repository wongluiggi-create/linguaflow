import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { XPBar } from '../components/ui/XPBar'
import { CURRICULUM } from '../data/curriculum'

const PRACTICE_MODULES = [
  { key: 'vocabulary', label: 'Vocabulario', icon: '📖', color: '#14b8a6', desc: 'Flashcards spaced repetition', path: '/app/vocabulary' },
  { key: 'grammar',    label: 'Gramática',   icon: '✏️', color: '#7c6dfa', desc: 'Quizzes del currículo',      path: '/app/grammar'    },
  { key: 'listening',  label: 'Listening',   icon: '🎧', color: '#f0a500', desc: 'Dictado con audio real',     path: '/app/listening'  },
  { key: 'reading',    label: 'Reading',     icon: '📰', color: '#34d399', desc: 'Textos con comprensión',     path: '/app/reading'    },
  { key: 'speaking',   label: 'Speaking',    icon: '🗣️', color: '#fb7185', desc: 'Voz + feedback de IA',      path: '/app/speaking'   },
  { key: 'chat',       label: 'AI Chat',     icon: '🤖', color: '#38bdf8', desc: 'Conversación adaptativa',   path: '/app/chat'       },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { currentLevel, xp, wordsLearned, streak, completedCourses } = useAppStore()

  const levelData = CURRICULUM.find((l) => l.id === currentLevel)
  const totalCourses = levelData?.courses.length ?? 0
  const completedCount = levelData?.courses.filter((c) => completedCourses[c.id]).length ?? 0
  const progressPct = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }} className="animate-in">
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 6 }}>Bienvenido de vuelta 👋</p>
        <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 6, color: levelData?.color ?? 'var(--text)' }}>
          {levelData?.icon} {currentLevel}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>{levelData?.desc}</p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginBottom: 20,
        }}
      >
        {/* Racha */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '14px 12px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontWeight: 800, fontSize: 22, color: 'var(--gold)', marginBottom: 4 }}>
            {streak}🔥
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 12 }}>Racha</p>
        </div>

        {/* Words */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '14px 12px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontWeight: 800, fontSize: 22, color: 'var(--teal)', marginBottom: 4 }}>
            {wordsLearned}
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 12 }}>Palabras</p>
        </div>

        {/* Courses */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '14px 12px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontWeight: 800, fontSize: 22, color: 'var(--accent)', marginBottom: 4 }}>
            {completedCount}/{totalCourses}
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 12 }}>Cursos</p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '16px 18px',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Progreso total</span>
          <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 14 }}>{progressPct}%</span>
        </div>
        <XPBar value={completedCount} max={Math.max(totalCourses, 1)} color="var(--accent)" />
      </div>

      {/* Daily practice */}
      <h3 style={{ fontWeight: 700, fontSize: 13, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
        Práctica diaria
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {PRACTICE_MODULES.map((mod) => (
          <ModuleCard key={mod.key} mod={mod} onClick={() => navigate(mod.path)} />
        ))}
      </div>

      {/* XP total footnote */}
      <p style={{ color: 'var(--muted)', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
        ⭐ {xp} XP total acumulados
      </p>
    </div>
  )
}

interface ModDef {
  key: string
  label: string
  icon: string
  color: string
  desc: string
  path: string
}

function ModuleCard({ mod, onClick }: { mod: ModDef; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '16px 14px',
        textAlign: 'left',
        cursor: 'pointer',
        color: 'var(--text)',
        transition: 'border-color 0.15s, transform 0.15s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = mod.color + '88'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = 'var(--border)'
        el.style.transform = 'none'
      }}
    >
      {/* Icon square */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: mod.color + '2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          marginBottom: 10,
        }}
      >
        {mod.icon}
      </div>
      <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{mod.label}</p>
      <p style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.4 }}>{mod.desc}</p>
    </button>
  )
}
