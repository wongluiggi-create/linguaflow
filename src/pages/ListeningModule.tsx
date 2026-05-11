import { useState, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { LISTEN_SENTENCES } from '../data/listening'
import type { LevelId } from '../types'

const LEVEL_OPTIONS: { id: LevelId; color: string }[] = [
  { id: 'A1', color: '#34d399' },
  { id: 'A2', color: '#14b8a6' },
  { id: 'B1', color: '#38bdf8' },
  { id: 'B2', color: '#7c6dfa' },
  { id: 'C1', color: '#fb7185' },
]

function stripPunctuation(s: string) {
  return s.replace(/[.,!?;:'"()\-]/g, '').toLowerCase().trim()
}

function compareWords(input: string, target: string) {
  const targetWords = target.trim().split(/\s+/)
  const inputWords = input.trim().split(/\s+/)
  return targetWords.map((tw, i) => ({
    word: tw,
    correct: stripPunctuation(inputWords[i] ?? '') === stripPunctuation(tw),
  }))
}

function isExact(input: string, target: string) {
  return stripPunctuation(input) === stripPunctuation(target)
}

export default function ListeningModule() {
  const { addXP } = useAppStore()

  const [level, setLevel] = useState<LevelId>('A1')
  const [input, setInput] = useState('')
  const [verified, setVerified] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const levelColor = LEVEL_OPTIONS.find((l) => l.id === level)?.color ?? '#7c6dfa'
  const sentence = LISTEN_SENTENCES.find((s) => s.level === level)
  const hasTTS = 'speechSynthesis' in window

  const exact = sentence ? isExact(input, sentence.text) : false
  const wordResult = sentence && verified ? compareWords(input, sentence.text) : []

  function changeLevel(l: LevelId) {
    setLevel(l)
    setInput('')
    setVerified(false)
    setPlayCount(0)
    setIsPlaying(false)
    window.speechSynthesis?.cancel()
  }

  function play() {
    if (!sentence) return
    try {
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(sentence.text)
      utt.lang = 'en-US'
      utt.rate = 0.82
      utt.onstart = () => setIsPlaying(true)
      utt.onend = () => setIsPlaying(false)
      utt.onerror = () => setIsPlaying(false)
      synthRef.current = utt
      window.speechSynthesis.speak(utt)
      setPlayCount((n) => n + 1)
    } catch {
      setIsPlaying(false)
    }
  }

  function verify() {
    if (!input.trim() || !sentence) return
    setVerified(true)
    if (exact) {
      addXP(40)
    } else {
      addXP(10)
    }
  }

  function retry() {
    setInput('')
    setVerified(false)
    setPlayCount(0)
    setIsPlaying(false)
    window.speechSynthesis?.cancel()
  }

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }} className="animate-in">
      {/* Header */}
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>🎧 Listening</h2>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>Escucha y escribe lo que oyes</p>

      {/* Level selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {LEVEL_OPTIONS.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => changeLevel(lvl.id)}
            style={{
              background: level === lvl.id ? lvl.color : 'var(--surface)',
              border: `1.5px solid ${level === lvl.id ? lvl.color : 'var(--border)'}`,
              borderRadius: 20,
              padding: '5px 14px',
              fontSize: 13,
              fontWeight: 700,
              color: level === lvl.id ? '#fff' : lvl.color,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
          >
            {lvl.id}
          </button>
        ))}
      </div>

      {/* Audio card */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          padding: '28px 24px',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        {!hasTTS && (
          <p style={{ color: 'var(--coral)', fontSize: 13, marginBottom: 16 }}>
            ⚠️ Usa Chrome para la síntesis de voz
          </p>
        )}

        {playCount === 0 && hasTTS && (
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 14 }}>
            💡 Escucha primero, luego escribe lo que oíste
          </p>
        )}

        {/* Play button */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
          {isPlaying && (
            <>
              <style>{`
                @keyframes ripple {
                  0% { transform: scale(1); opacity: 0.5; }
                  100% { transform: scale(1.8); opacity: 0; }
                }
              `}</style>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: levelColor + '44',
                    animation: `ripple 1.4s ease-out ${i * 0.4}s infinite`,
                    pointerEvents: 'none',
                  }}
                />
              ))}
            </>
          )}
          <button
            onClick={play}
            disabled={!hasTTS}
            style={{
              position: 'relative',
              background: isPlaying ? levelColor + 'cc' : levelColor,
              border: 'none',
              borderRadius: '50%',
              width: 76,
              height: 76,
              fontSize: 28,
              cursor: hasTTS ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {isPlaying ? '🔊' : '▶️'}
          </button>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: 12 }}>
          {playCount === 0 ? 'Presiona para escuchar' : `Escuchas: ${playCount}`}
        </p>
      </div>

      {/* Textarea */}
      <div style={{ marginBottom: 14 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={verified}
          placeholder="Escribe lo que escuchas..."
          rows={3}
          style={{
            width: '100%',
            background: 'var(--surface)',
            border: `1.5px solid ${
              verified ? (exact ? '#34d399' : '#fb7185') : 'var(--border)'
            }`,
            borderRadius: 12,
            padding: '12px 14px',
            color: 'var(--text)',
            fontSize: 15,
            resize: 'none',
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
        />
      </div>

      {/* Word-by-word result */}
      {verified && sentence && (
        <div
          style={{
            background: exact ? '#34d39912' : '#fb718512',
            border: `1px solid ${exact ? '#34d399' : '#fb7185'}`,
            borderRadius: 14,
            padding: '16px 18px',
            marginBottom: 16,
          }}
        >
          <p style={{ fontWeight: 700, color: exact ? '#34d399' : '#fb7185', marginBottom: 10, fontSize: 14 }}>
            {exact ? '✓ ¡Perfecto! +40 XP' : '✗ Revisa las diferencias +10 XP'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {wordResult.map((w, i) => (
              <span
                key={i}
                style={{
                  color: w.correct ? '#34d399' : '#fb7185',
                  fontWeight: w.correct ? 400 : 700,
                  fontSize: 15,
                  textDecoration: w.correct ? 'none' : 'underline',
                }}
              >
                {w.word}
              </span>
            ))}
          </div>
          {!exact && (
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 10 }}>
              <strong style={{ color: 'var(--text)' }}>Frase correcta:</strong> {sentence.text}
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      {!verified ? (
        <button
          onClick={verify}
          disabled={!input.trim() || playCount === 0}
          style={{
            background:
              input.trim() && playCount > 0 ? levelColor : 'var(--faint)',
            border: 'none',
            borderRadius: 12,
            padding: '13px 0',
            width: '100%',
            color: input.trim() && playCount > 0 ? '#fff' : 'var(--muted)',
            fontWeight: 700,
            fontSize: 15,
            cursor: input.trim() && playCount > 0 ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            transition: 'background 0.2s',
          }}
        >
          Verificar
        </button>
      ) : (
        <button
          onClick={retry}
          style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 12,
            padding: '13px 0',
            width: '100%',
            color: 'var(--text)',
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Intentar de nuevo
        </button>
      )}
    </div>
  )
}
