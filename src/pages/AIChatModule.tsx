import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const LEVEL_COLORS: Record<string, string> = {
  A1: '#34d399', A2: '#14b8a6', B1: '#38bdf8', B2: '#7c6dfa', C1: '#fb7185', ESP: '#a78bfa', Biz: '#f59e0b',
}

const SUGGESTIONS_LOW = [
  'Hello! My name is…',
  'Teach me basic words',
  'What is "schedule"?',
  'Correct my English',
]
const SUGGESTIONS_HIGH = [
  "Let's discuss current events",
  'Explain phrasal verbs',
  'Practice a job interview',
  'Correct my grammar',
]

function getInitialGreeting(level: string) {
  return `Hello! I'm your English tutor 🎓 I'm adapting my language to your ${level} level.\n\nWe can have a free conversation, practice specific grammar, or I can explain vocabulary. What would you like to work on?`
}

export default function AIChatModule() {
  const { currentLevel, addXP } = useAppStore()
  const levelColor = LEVEL_COLORS[currentLevel] ?? '#7c6dfa'

  const [displayMessages, setDisplayMessages] = useState<Message[]>([
    { role: 'assistant', content: getInitialGreeting(currentLevel) },
  ])
  // API history excludes the hardcoded greeting
  const [apiHistory, setApiHistory] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const isLowLevel = ['A1', 'A2'].includes(currentLevel)
  const suggestions = isLowLevel ? SUGGESTIONS_LOW : SUGGESTIONS_HIGH
  const showSuggestions = displayMessages.length <= 2

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages, loading])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const newApiHistory = [...apiHistory, userMsg]

    setDisplayMessages((prev) => [...prev, userMsg])
    setApiHistory(newApiHistory)
    setInput('')
    setLoading(true)

    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (!apiKey) {
      const err: Message = {
        role: 'assistant',
        content: '⚠️ Añade VITE_ANTHROPIC_API_KEY en .env.local para activar el tutor de IA.',
      }
      setDisplayMessages((prev) => [...prev, err])
      setApiHistory((prev) => [...prev, err])
      setLoading(false)
      return
    }

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
          max_tokens: 400,
          system: `You are an expert English tutor for a ${currentLevel} level student.
- Adapt vocabulary and complexity to ${currentLevel} level
- Correct grammar mistakes naturally: say "Note: [correction]" briefly after your response
- Ask one follow-up question to keep the conversation going
- Introduce 1 new vocabulary word when relevant, with a brief definition in parentheses
- Be warm, encouraging, and patient
- Keep responses to 3-4 sentences usually. For explanations, up to 6 is fine.`,
          messages: newApiHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error(await res.text())

      const data = await res.json() as { content: { type: string; text: string }[] }
      const reply = data.content.find((c) => c.type === 'text')?.text ?? '…'
      const aiMsg: Message = { role: 'assistant', content: reply }
      setDisplayMessages((prev) => [...prev, aiMsg])
      setApiHistory((prev) => [...prev, aiMsg])
      addXP(10)
    } catch (e) {
      console.error(e)
      const errMsg: Message = {
        role: 'assistant',
        content: 'Hmm, I had trouble connecting. Please check your API key and try again!',
      }
      setDisplayMessages((prev) => [...prev, errMsg])
      setApiHistory((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: 580,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100dvh - 140px)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 2 }}>🤖 AI Tutor</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Practica inglés con tu tutor inteligente</p>
        </div>
        <span
          style={{
            background: levelColor + '22',
            color: levelColor,
            border: `1px solid ${levelColor}44`,
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {currentLevel}
        </span>
      </div>

      {/* Quick suggestions */}
      {showSuggestions && (
        <div style={{ display: 'flex', gap: 7, marginBottom: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '6px 14px',
                fontSize: 12,
                color: 'var(--text)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontFamily: 'inherit',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = levelColor }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
        {displayMessages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 8,
            }}
          >
            {msg.role === 'assistant' && (
              <span style={{ fontSize: 20, flexShrink: 0 }}>🤖</span>
            )}
            <div
              style={{
                maxWidth: '78%',
                background: msg.role === 'user' ? levelColor : 'var(--surface-up)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                borderRadius:
                  msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '11px 15px',
                fontSize: 14,
                lineHeight: 1.65,
                color: msg.role === 'user' ? '#fff' : 'var(--text)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <div
              style={{
                background: 'var(--surface-up)',
                border: '1px solid var(--border)',
                borderRadius: '18px 18px 18px 4px',
                padding: '12px 18px',
                display: 'flex',
                gap: 4,
                alignItems: 'center',
              }}
            >
              <style>{`
                @keyframes bounce {
                  0%, 80%, 100% { transform: translateY(0); }
                  40% { transform: translateY(-5px); }
                }
              `}</style>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: 'var(--muted)',
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '10px 12px',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage(input)
            }
          }}
          disabled={loading}
          placeholder="Write in English…"
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontSize: 14,
            fontFamily: 'inherit',
            padding: '4px 0',
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          style={{
            background: input.trim() && !loading ? levelColor : 'var(--faint)',
            border: 'none',
            borderRadius: 10,
            padding: '8px 16px',
            color: input.trim() && !loading ? '#fff' : 'var(--muted)',
            fontWeight: 700,
            fontSize: 13,
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
            fontFamily: 'inherit',
            flexShrink: 0,
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
