import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { READINGS } from '../data/readings'
import type { ReadingArticle } from '../types'

const LEVEL_COLORS: Record<string, string> = {
  A1: '#34d399',
  A2: '#14b8a6',
  B1: '#38bdf8',
  B2: '#7c6dfa',
  C1: '#fb7185',
  ESP: '#a78bfa',
  Biz: '#f59e0b',
}

type View = 'list' | 'article'

export default function ReadingModule() {
  const { addXP } = useAppStore()

  const [view, setView] = useState<View>('list')
  const [activeArticle, setActiveArticle] = useState<ReadingArticle | null>(null)
  const [showVocab, setShowVocab] = useState(false)
  // answers[qIdx] = selected option index (or null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [verified, setVerified] = useState(false)
  const [lastScore, setLastScore] = useState(0)

  function openArticle(article: ReadingArticle) {
    setActiveArticle(article)
    setAnswers(Array(article.questions.length).fill(null))
    setVerified(false)
    setLastScore(0)
    setShowVocab(false)
    setView('article')
  }

  function selectAnswer(qIdx: number, optIdx: number) {
    if (verified) return
    setAnswers((prev) => {
      const next = [...prev]
      next[qIdx] = optIdx
      return next
    })
  }

  function verify() {
    if (!activeArticle) return
    const sc = activeArticle.questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.a ? 1 : 0),
      0,
    )
    setLastScore(sc)
    setVerified(true)
    addXP(sc * 25)
  }

  const allAnswered = answers.length > 0 && answers.every((a) => a !== null)

  // ── LIST VIEW ──
  if (view === 'list') {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>📰 Reading</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>
          Lee artículos auténticos y responde preguntas de comprensión
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {READINGS.map((article, idx) => {
            const color = LEVEL_COLORS[article.level] ?? 'var(--accent)'
            return (
              <button
                key={idx}
                onClick={() => openArticle(article)}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '16px 18px',
                  display: 'flex',
                  gap: 14,
                  cursor: 'pointer',
                  color: 'var(--text)',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'border-color 0.15s, background 0.15s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color + '88'
                  e.currentTarget.style.background = color + '0a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--surface)'
                }}
              >
                <span style={{ fontSize: 36, alignSelf: 'flex-start' }}>📰</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{article.title}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {/* Topic */}
                    <span
                      style={{
                        background: 'var(--faint)',
                        borderRadius: 20,
                        padding: '3px 10px',
                        fontSize: 11,
                        color: 'var(--muted)',
                      }}
                    >
                      {article.topic}
                    </span>
                    {/* Read time */}
                    <span
                      style={{
                        background: 'var(--faint)',
                        borderRadius: 20,
                        padding: '3px 10px',
                        fontSize: 11,
                        color: 'var(--muted)',
                      }}
                    >
                      ⏱ {article.readTime}
                    </span>
                    {/* Level */}
                    <span
                      style={{
                        background: color + '22',
                        color,
                        border: `1px solid ${color}44`,
                        borderRadius: 20,
                        padding: '3px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {article.level}
                    </span>
                  </div>
                  {/* Vocab preview */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {article.vocab.slice(0, 4).map((v) => (
                      <span
                        key={v}
                        style={{
                          background: 'var(--mint)18',
                          color: 'var(--mint)',
                          borderRadius: 20,
                          padding: '2px 8px',
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      >
                        {v}
                      </span>
                    ))}
                    {article.vocab.length > 4 && (
                      <span style={{ fontSize: 11, color: 'var(--muted)', alignSelf: 'center' }}>
                        +{article.vocab.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── ARTICLE VIEW ──
  if (!activeArticle) return null
  const color = LEVEL_COLORS[activeArticle.level] ?? 'var(--accent)'

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Back */}
      <button
        onClick={() => setView('list')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          fontSize: 14,
          cursor: 'pointer',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: 0,
          fontFamily: 'inherit',
        }}
      >
        ← Volver
      </button>

      {/* Article header */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <span
          style={{
            background: color + '22',
            color,
            border: `1px solid ${color}44`,
            borderRadius: 20,
            padding: '3px 10px',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {activeArticle.level}
        </span>
        <span style={{ background: 'var(--faint)', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: 'var(--muted)' }}>
          {activeArticle.topic}
        </span>
        <span style={{ background: 'var(--faint)', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: 'var(--muted)' }}>
          ⏱ {activeArticle.readTime}
        </span>
      </div>
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 16 }}>{activeArticle.title}</h2>

      {/* Article text */}
      <div
        style={{
          background: 'rgba(0,0,0,0.28)',
          borderRadius: 14,
          padding: '20px 22px',
          marginBottom: 16,
        }}
      >
        {activeArticle.content.split('\n\n').map((para, i) => (
          <p key={i} style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--text)', margin: i > 0 ? '14px 0 0' : 0 }}>
            {para}
          </p>
        ))}
      </div>

      {/* Vocabulary toggle */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowVocab((v) => !v)}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '7px 14px',
            fontSize: 13,
            color: 'var(--teal)',
            cursor: 'pointer',
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          {showVocab ? 'Ocultar' : 'Ver'} vocabulario clave
        </button>
        {showVocab && (
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
            {activeArticle.vocab.map((v) => (
              <span
                key={v}
                style={{
                  background: 'var(--teal)22',
                  color: 'var(--teal)',
                  border: '1px solid var(--teal)44',
                  borderRadius: 20,
                  padding: '4px 12px',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comprehension section */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '20px 18px',
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Comprensión lectora</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {activeArticle.questions.map((q, qIdx) => (
            <div key={qIdx}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, lineHeight: 1.4 }}>
                {qIdx + 1}. {q.q}
              </p>
              {/* Options in 2-column grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {q.opts.map((opt, optIdx) => {
                  const isSelected = answers[qIdx] === optIdx
                  const isCorrect = optIdx === q.a

                  let bg = 'var(--surface-up)'
                  let border = 'var(--border)'
                  let textColor = 'var(--muted)'

                  if (!verified && isSelected) {
                    bg = color + '22'
                    border = color
                    textColor = '#fff'
                  }
                  if (verified) {
                    if (isCorrect) {
                      bg = '#34d39920'
                      border = '#34d399'
                      textColor = '#34d399'
                    } else if (isSelected && !isCorrect) {
                      bg = '#fb718520'
                      border = '#fb7185'
                      textColor = '#fb7185'
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => selectAnswer(qIdx, optIdx)}
                      disabled={verified}
                      style={{
                        background: bg,
                        border: `1.5px solid ${border}`,
                        borderRadius: 9,
                        padding: '9px 12px',
                        fontSize: 13,
                        color: textColor,
                        cursor: verified ? 'default' : 'pointer',
                        textAlign: 'left',
                        fontWeight: isSelected || (verified && isCorrect) ? 600 : 400,
                        transition: 'all 0.15s',
                        lineHeight: 1.4,
                        fontFamily: 'inherit',
                      }}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Verify button */}
        {!verified && (
          <div style={{ marginTop: 20 }}>
            <button
              onClick={verify}
              disabled={!allAnswered}
              style={{
                background: allAnswered ? color : 'var(--faint)',
                border: 'none',
                borderRadius: 12,
                padding: '13px 0',
                width: '100%',
                color: allAnswered ? '#fff' : 'var(--muted)',
                fontWeight: 700,
                fontSize: 15,
                cursor: allAnswered ? 'pointer' : 'not-allowed',
                transition: 'background 0.2s',
                fontFamily: 'inherit',
              }}
            >
              Verificar respuestas
            </button>
          </div>
        )}
      </div>

      {/* Result card */}
      {verified && (
        <div
          style={{
            background:
              lastScore === activeArticle.questions.length
                ? '#34d39918'
                : '#f0a50018',
            border: `1px solid ${lastScore === activeArticle.questions.length ? '#34d399' : '#f0a500'}`,
            borderRadius: 14,
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: 16,
                color:
                  lastScore === activeArticle.questions.length
                    ? 'var(--mint)'
                    : 'var(--gold)',
              }}
            >
              {lastScore === activeArticle.questions.length
                ? '🎉 ¡Perfecto!'
                : `📖 ${lastScore}/${activeArticle.questions.length} correctas`}
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 3 }}>
              +{lastScore * 25} XP ganados
            </p>
          </div>
          <button
            onClick={() => setView('list')}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '8px 14px',
              color: 'var(--text)',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Más artículos
          </button>
        </div>
      )}
    </div>
  )
}
