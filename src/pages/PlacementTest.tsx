import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { updateLevel as updateLevelFirestore } from '../lib/userService'
import type { LevelId } from '../types'

const QUESTIONS = [
  { q: 'She ___ a doctor.', opts: ['am', 'is', 'are', 'be'], a: 1, level: 'A1' },
  { q: 'I ___ to school every day.', opts: ['go', 'goes', 'going', 'gone'], a: 0, level: 'A1' },
  { q: '___ you like pizza? Yes, I ___.', opts: ['Do/do', 'Does/do', 'Do/does', 'Is/am'], a: 0, level: 'A2' },
  { q: 'If it rains tomorrow, we ___ stay home.', opts: ['will', 'would', 'should', 'might'], a: 0, level: 'B1' },
  { q: 'She ___ already left when I arrived.', opts: ['has', 'have', 'had', 'was'], a: 2, level: 'B2' },
  { q: 'The policy ___ by the committee last week.', opts: ['approved', 'was approved', 'has approved', 'is approving'], a: 1, level: 'B2' },
]

const LEVEL_INFO: Record<string, { color: string; label: string; desc: string }> = {
  A1: { color: '#34d399', label: 'A1 — Principiante', desc: 'Estás comenzando. El plan A1 te dará las bases del inglés de forma clara y progresiva.' },
  A2: { color: '#14b8a6', label: 'A2 — Básico+', desc: 'Conoces saludos y frases simples. Avanzarás rápido con el plan A2.' },
  B1: { color: '#38bdf8', label: 'B1 — Intermedio', desc: 'Puedes comunicarte en situaciones cotidianas. El plan B1 ampliará tu fluidez.' },
  B2: { color: '#7c6dfa', label: 'B2 — Intermedio Alto', desc: 'Te expresas con fluidez en la mayoría de situaciones. El plan B2 te prepara para contextos exigentes.' },
  C1: { color: '#fb7185', label: 'C1 — Avanzado', desc: 'Dominas el inglés en contextos complejos. El plan C1 perfeccionará tu precisión.' },
}

function getSuggestedLevel(correct: number): LevelId {
  if (correct <= 1) return 'A1'
  if (correct === 2) return 'A2'
  if (correct === 3) return 'B1'
  if (correct <= 5) return 'B2'
  return 'C1'
}

export default function PlacementTest() {
  const navigate = useNavigate()
  const { setScreen, setLevel, uid } = useAppStore()

  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  const totalCorrect = answers.filter(Boolean).length
  const suggestedLevel = getSuggestedLevel(totalCorrect)
  const info = LEVEL_INFO[suggestedLevel]
  const q = QUESTIONS[qIndex]
  const isAnswered = selected !== null

  function handleAnswer(idx: number) {
    if (selected !== null) return
    const isCorrect = idx === q.a
    setSelected(idx)
    setAnswers((prev) => [...prev, isCorrect])

    setTimeout(() => {
      if (qIndex < QUESTIONS.length - 1) {
        setQIndex((i) => i + 1)
        setSelected(null)
      } else {
        setDone(true)
      }
    }, 900)
  }

  async function startFromLevel(level: LevelId) {
    setLevel(level)
    setScreen('app')
    if (uid) {
      try {
        await updateLevelFirestore(uid, level)
      } catch {
        // silent — Firestore may not be configured
      }
    }
    navigate('/app/dashboard')
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        color: 'var(--text)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ maxWidth: 500, width: '100%' }}>
        {!done ? (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, fontSize: 20 }}>Test de Nivel</h2>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>
                {qIndex + 1} / {QUESTIONS.length}
              </span>
            </div>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === qIndex ? 22 : 8,
                    height: 8,
                    borderRadius: 4,
                    background:
                      i < qIndex
                        ? answers[i]
                          ? '#34d399'
                          : '#fb7185'
                        : i === qIndex
                          ? 'var(--accent)'
                          : 'var(--faint)',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>

            {/* Question card */}
            <div
              style={{
                background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                borderRadius: 16,
                padding: '32px 24px',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: 20, fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>{q.q}</p>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.opts.map((opt, idx) => {
                let bg = 'var(--surface)'
                let border = 'var(--border)'
                let color = 'var(--text)'
                let fw: number | string = 400
                if (isAnswered) {
                  if (idx === q.a) { bg = '#34d39918'; border = '#34d399'; color = '#34d399'; fw = 700 }
                  else if (idx === selected) { bg = '#fb718518'; border = '#fb7185'; color = '#fb7185'; fw = 700 }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    style={{
                      background: bg,
                      border: `1.5px solid ${border}`,
                      borderRadius: 12,
                      padding: '14px 18px',
                      textAlign: 'left',
                      color,
                      fontSize: 15,
                      fontWeight: fw,
                      cursor: isAnswered ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          /* Result screen */
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎯</div>
            <h2 style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>Test Completado</h2>
            <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 28 }}>
              {totalCorrect} de {QUESTIONS.length} respuestas correctas
            </p>

            {/* Level card */}
            <div
              style={{
                background: `${info.color}14`,
                border: `1.5px solid ${info.color}55`,
                borderRadius: 18,
                padding: '24px',
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                Nivel sugerido
              </p>
              <p style={{ color: info.color, fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{info.label}</p>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.65 }}>{info.desc}</p>
            </div>

            {/* Primary CTA */}
            <button
              onClick={() => startFromLevel(suggestedLevel)}
              style={{
                background: info.color,
                border: 'none',
                borderRadius: 14,
                padding: '15px 0',
                width: '100%',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                marginBottom: 14,
                fontFamily: 'inherit',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            >
              Comenzar desde {suggestedLevel} →
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => startFromLevel('A1')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0',
                color: 'var(--muted)',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Empezar desde A1 igualmente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
