import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { VOCAB_BY_LEVEL } from '../data/vocabulary'
import type { LevelId } from '../types'

// Levels available in the vocabulary bank
const VOCAB_LEVELS: { id: LevelId; color: string }[] = [
  { id: 'A1', color: '#34d399' },
  { id: 'A2', color: '#14b8a6' },
  { id: 'B1', color: '#38bdf8' },
  { id: 'B2', color: '#7c6dfa' },
  { id: 'C1', color: '#fb7185' },
]

type CardState = 'pending' | 'known' | 'review'

export default function VocabularyModule() {
  const { addXP } = useAppStore()

  const [selectedLevel, setSelectedLevel] = useState<LevelId>('A1')
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [cardStates, setCardStates] = useState<CardState[]>(
    Array(VOCAB_BY_LEVEL['A1']?.length ?? 0).fill('pending'),
  )

  const levelColor = VOCAB_LEVELS.find((l) => l.id === selectedLevel)?.color ?? '#7c6dfa'
  const words = VOCAB_BY_LEVEL[selectedLevel] ?? []
  const word = words[idx]

  const knownCount = cardStates.filter((s) => s === 'known').length
  const reviewCount = cardStates.filter((s) => s === 'review').length

  function changeLevel(level: LevelId) {
    const newWords = VOCAB_BY_LEVEL[level] ?? []
    setSelectedLevel(level)
    setIdx(0)
    setFlipped(false)
    setCardStates(Array(newWords.length).fill('pending'))
  }

  function advance(state: CardState, xpGain: number) {
    const next = (idx + 1) % words.length
    setCardStates((prev) => {
      const updated = [...prev]
      updated[idx] = state
      return updated
    })
    if (xpGain > 0) addXP(xpGain)
    setFlipped(false)
    // Small delay so the card flips back before switching
    setTimeout(() => setIdx(next), 200)
  }

  if (!word) return null

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontWeight: 800, fontSize: 22 }}>📖 Vocabulario</h2>
      </div>

      {/* Level selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {VOCAB_LEVELS.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => changeLevel(lvl.id)}
            style={{
              background: selectedLevel === lvl.id ? lvl.color : 'var(--surface)',
              border: `1.5px solid ${selectedLevel === lvl.id ? lvl.color : 'var(--border)'}`,
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: 13,
              fontWeight: 700,
              color: selectedLevel === lvl.id ? '#fff' : lvl.color,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {lvl.id}
          </button>
        ))}
      </div>

      {/* Session stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Learned', value: knownCount, color: 'var(--mint)' },
          { label: 'Review', value: reviewCount, color: 'var(--gold)' },
          { label: `Card ${idx + 1}/${words.length}`, value: '', color: levelColor },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '10px 12px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 20, color: stat.color }}>
              {stat.value !== '' ? stat.value : <span style={{ fontSize: 13 }}>{stat.label}</span>}
            </div>
            {stat.value !== '' && (
              <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 2 }}>{stat.label}</div>
            )}
          </div>
        ))}
      </div>

      {/* Flip card — 3D CSS */}
      <div
        onClick={() => setFlipped((f) => !f)}
        style={{ perspective: 1200, height: 300, marginBottom: 20, cursor: 'pointer' }}
      >
        <div
          style={{
            position: 'relative',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: 'var(--surface)',
              border: `1.5px solid var(--border)`,
              borderRadius: 18,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              textAlign: 'center',
            }}
          >
            {/* Level pill */}
            <span
              style={{
                background: levelColor + '22',
                color: levelColor,
                border: `1px solid ${levelColor}44`,
                borderRadius: 20,
                padding: '3px 12px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              {selectedLevel}
            </span>
            {/* Word */}
            <span style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-1px' }}>{word.word}</span>
            {/* Phonetic */}
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: 17,
                color: 'var(--muted)',
                letterSpacing: '0.04em',
              }}
            >
              {word.phonetic}
            </span>
            {/* Tip on front */}
            {word.tip && (
              <span style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: 13 }}>
                💡 {word.tip}
              </span>
            )}
            <span style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>
              Toca para ver la definición
            </span>
          </div>

          {/* Back */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'var(--surface)',
              border: `1.5px solid ${levelColor}55`,
              borderRadius: 18,
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              justifyContent: 'center',
            }}
          >
            {/* Word repeated */}
            <span style={{ fontSize: 22, fontWeight: 800 }}>{word.word}</span>
            {/* Definition in level color */}
            <p style={{ color: levelColor, fontSize: 16, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
              {word.definition}
            </p>
            {/* Example with gold left border */}
            <div
              style={{
                borderLeft: `3px solid var(--gold)`,
                paddingLeft: 12,
                fontStyle: 'italic',
                color: 'var(--text)',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              "{word.example}"
            </div>
            {/* Tip with accent left border */}
            {word.tip && (
              <div
                style={{
                  borderLeft: `3px solid var(--accent)`,
                  paddingLeft: 12,
                  color: 'var(--muted)',
                  fontSize: 13,
                }}
              >
                {word.tip}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
        {words.map((_, i) => {
          const state = cardStates[i]
          const bg =
            state === 'known'
              ? 'var(--mint)'
              : state === 'review'
                ? 'var(--gold)'
                : i === idx
                  ? levelColor
                  : 'var(--faint)'
          return (
            <button
              key={i}
              onClick={() => { setIdx(i); setFlipped(false) }}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: bg,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'background 0.2s',
              }}
            />
          )
        })}
      </div>

      {/* Action buttons — only shown after flip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button
          onClick={() => advance('review', 0)}
          style={{
            background: 'transparent',
            border: `1.5px solid var(--gold)`,
            borderRadius: 12,
            padding: '12px 0',
            color: 'var(--gold)',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            opacity: flipped ? 1 : 0.4,
            transition: 'opacity 0.2s',
          }}
        >
          🔄 Repasar
        </button>
        <button
          onClick={() => { if (flipped) advance('known', 15) }}
          style={{
            background: flipped ? 'var(--mint)' : 'var(--faint)',
            border: 'none',
            borderRadius: 12,
            padding: '12px 0',
            color: flipped ? '#fff' : 'var(--muted)',
            fontWeight: 700,
            fontSize: 15,
            cursor: flipped ? 'pointer' : 'default',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          ✓ Lo sé (+15 XP)
        </button>
      </div>

      {/* All learned banner */}
      {knownCount === words.length && (
        <div
          style={{
            marginTop: 20,
            background: 'var(--mint)22',
            border: '1px solid var(--mint)',
            borderRadius: 14,
            padding: 18,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 28 }}>🎉</p>
          <p style={{ fontWeight: 700, color: 'var(--mint)', marginTop: 6 }}>
            ¡Has aprendido todas las palabras de {selectedLevel}!
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
            +{words.length * 15} XP ganados en esta sesión
          </p>
        </div>
      )}
    </div>
  )
}
