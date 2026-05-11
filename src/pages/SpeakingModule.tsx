import { useState, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import { SPEAK_PROMPTS } from '../data/speaking'
import type { LevelId } from '../types'

const LEVEL_COLORS: Record<string, string> = {
  A1: '#34d399', A2: '#14b8a6', B1: '#38bdf8', B2: '#7c6dfa', C1: '#fb7185',
}

// Closest level for prompt filtering when no exact match exists
const LEVEL_ORDER: LevelId[] = ['A1', 'A2', 'B1', 'B2', 'C1']

function getPromptsForLevel(level: LevelId) {
  const exact = SPEAK_PROMPTS.filter((p) => p.level === level)
  if (exact.length > 0) return exact
  // Fallback: all prompts with levels adjacent in order
  const idx = LEVEL_ORDER.indexOf(level)
  if (idx > 0) {
    const adjacent = SPEAK_PROMPTS.filter((p) => p.level === LEVEL_ORDER[idx - 1])
    if (adjacent.length > 0) return adjacent
  }
  return SPEAK_PROMPTS
}

interface FeedbackData {
  positive: string
  grammar_issues: { error: string; correction: string; explanation: string }[]
  tip: string
}

function getSpeechRecognizer(): (new () => SpeechRecognition) | undefined {
  if ('SpeechRecognition' in window) {
    return (window as unknown as { SpeechRecognition: new () => SpeechRecognition }).SpeechRecognition
  }
  if ('webkitSpeechRecognition' in window) {
    return (window as unknown as { webkitSpeechRecognition: new () => SpeechRecognition }).webkitSpeechRecognition
  }
  return undefined
}

export default function SpeakingModule() {
  const { currentLevel, addXP } = useAppStore()
  const levelColor = LEVEL_COLORS[currentLevel] ?? '#7c6dfa'

  const prompts = getPromptsForLevel(currentLevel as LevelId)
  const [promptIdx, setPromptIdx] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [feedbackError, setFeedbackError] = useState('')

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const currentPrompt = prompts[promptIdx]
  const wordCount = transcript.trim() ? transcript.trim().split(/\s+/).length : 0

  function nextPrompt() {
    stopRecording()
    setPromptIdx((i) => (i + 1) % prompts.length)
    setTranscript('')
    setFeedback(null)
    setFeedbackError('')
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRecording(false)
  }

  function toggleRecording() {
    if (isRecording) {
      stopRecording()
      return
    }

    const Recognizer = getSpeechRecognizer()
    if (!Recognizer) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome para esta función.')
      return
    }

    setTranscript('')
    setFeedback(null)
    setFeedbackError('')

    const rec = new Recognizer()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = true

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = 0; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t + ' '
        else interim += t
      }
      setTranscript((final + interim).trim())
    }

    rec.onerror = () => {
      setIsRecording(false)
      recognitionRef.current = null
    }

    rec.onend = () => {
      setIsRecording(false)
      recognitionRef.current = null
    }

    rec.start()
    recognitionRef.current = rec
    setIsRecording(true)
  }

  async function getFeedback() {
    if (!transcript.trim() || !currentPrompt) return
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) {
      setFeedbackError('Añade VITE_ANTHROPIC_API_KEY en .env.local para obtener feedback de IA.')
      return
    }

    setLoadingFeedback(true)
    setFeedback(null)
    setFeedbackError('')

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system:
            'You are an expert English speaking coach. Return ONLY valid JSON with keys: positive (string), grammar_issues (array max 2, each with {error, correction, explanation}), tip (string). No markdown, no explanation.',
          messages: [
            {
              role: 'user',
              content: `Level: ${currentLevel}\nPrompt: "${currentPrompt.text}"\nStudent said: "${transcript}"\n\nJSON only:`,
            },
          ],
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(err)
      }

      const data = await res.json() as { content: { type: string; text: string }[] }
      const raw = data.content.find((c) => c.type === 'text')?.text ?? '{}'
      const parsed: FeedbackData = JSON.parse(raw)
      setFeedback(parsed)
      addXP(25)
    } catch (e) {
      setFeedbackError('No se pudo obtener feedback. Verifica tu API key y conexión.')
      console.error(e)
    } finally {
      setLoadingFeedback(false)
    }
  }

  return (
    <div style={{ maxWidth: 540, margin: '0 auto' }} className="animate-in">
      {/* Header */}
      <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>🗣️ Speaking</h2>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
        Lee el prompt, graba tu respuesta y recibe feedback de IA
      </p>

      {/* Prompt card */}
      <div
        style={{
          background: 'var(--surface)',
          border: `1.5px solid ${levelColor}44`,
          borderRadius: 18,
          padding: '20px 22px',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Prompt
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                background: levelColor + '22',
                color: levelColor,
                border: `1px solid ${levelColor}44`,
                borderRadius: 20,
                padding: '2px 9px',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {currentPrompt?.level ?? currentLevel}
            </span>
            <button
              onClick={nextPrompt}
              style={{
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 12,
                color: 'var(--muted)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              → Otro prompt
            </button>
          </div>
        </div>
        <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5, margin: 0 }}>
          {currentPrompt?.text ?? ''}
        </p>
      </div>

      {/* Microphone */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
          {isRecording && (
            <>
              <style>{`
                @keyframes pulse-ring {
                  0% { transform: scale(1); opacity: 0.6; }
                  100% { transform: scale(1.7); opacity: 0; }
                }
              `}</style>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: '#fb718544',
                    animation: `pulse-ring 1.2s ease-out ${i * 0.35}s infinite`,
                    pointerEvents: 'none',
                  }}
                />
              ))}
            </>
          )}
          <button
            onClick={toggleRecording}
            style={{
              position: 'relative',
              background: isRecording ? 'var(--coral)' : 'var(--surface-up)',
              border: `2px solid ${isRecording ? 'var(--coral)' : 'var(--border)'}`,
              borderRadius: '50%',
              width: 88,
              height: 88,
              fontSize: 34,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {isRecording ? '⏹' : '🎤'}
          </button>
        </div>
        <p style={{ color: isRecording ? 'var(--coral)' : 'var(--muted)', fontSize: 13, fontWeight: isRecording ? 700 : 400 }}>
          {isRecording ? 'Grabando... toca para parar' : 'Toca para comenzar a hablar'}
        </p>
      </div>

      {/* Live transcript */}
      {(transcript || isRecording) && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '16px 18px',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Tu respuesta</span>
            <span style={{ fontSize: 12, color: levelColor, fontWeight: 700 }}>{wordCount} palabras</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: transcript ? 'var(--text)' : 'var(--muted)', fontStyle: transcript ? 'normal' : 'italic', margin: 0 }}>
            {transcript || 'Escuchando…'}
          </p>
        </div>
      )}

      {/* Feedback button */}
      {transcript && !isRecording && (
        <button
          onClick={getFeedback}
          disabled={loadingFeedback}
          style={{
            background: loadingFeedback ? 'var(--faint)' : 'var(--accent)',
            border: 'none',
            borderRadius: 12,
            padding: '13px 0',
            width: '100%',
            color: loadingFeedback ? 'var(--muted)' : '#fff',
            fontWeight: 700,
            fontSize: 15,
            cursor: loadingFeedback ? 'wait' : 'pointer',
            marginBottom: 14,
            fontFamily: 'inherit',
            transition: 'background 0.2s',
          }}
        >
          {loadingFeedback ? '⏳ Analizando tu inglés…' : '🤖 Obtener feedback de IA'}
        </button>
      )}

      {/* Error */}
      {feedbackError && (
        <div style={{ background: '#fb718518', border: '1px solid #fb7185', borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
          <p style={{ color: '#fb7185', fontSize: 13, margin: 0 }}>{feedbackError}</p>
        </div>
      )}

      {/* Feedback cards */}
      {feedback && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Positive */}
          <div style={{ background: '#34d39914', border: '1px solid #34d39955', borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ color: '#34d399', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>✓ Positivo</p>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{feedback.positive}</p>
          </div>

          {/* Grammar issues */}
          {feedback.grammar_issues.length > 0 && (
            <div style={{ background: '#f0a50014', border: '1px solid #f0a50055', borderRadius: 14, padding: '14px 16px' }}>
              <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>⚠️ Correcciones</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {feedback.grammar_issues.map((g, i) => (
                  <div key={i}>
                    <p style={{ fontSize: 14, margin: '0 0 4px' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--coral)' }}>{g.error}</span>
                      {' → '}
                      <strong style={{ color: 'var(--mint)' }}>{g.correction}</strong>
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{g.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          <div style={{ background: 'var(--accent)14', border: '1px solid var(--accent)44', borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>💡 Tip</p>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>{feedback.tip}</p>
          </div>
        </div>
      )}
    </div>
  )
}
