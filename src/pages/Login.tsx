import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { signInWithGoogle } = useAuth()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState('')

  async function handleGoogle() {
    setGoogleLoading(true)
    setGoogleError('')
    try {
      await signInWithGoogle()
    } catch {
      setGoogleError('No se pudo iniciar sesión. Verifica la configuración de Firebase.')
    } finally {
      setGoogleLoading(false)
    }
  }

  function handleGuest() {
    navigate('/placement')
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
        padding: '24px 20px',
      }}
    >
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        {/* Logo */}
        <div style={{ fontSize: 64, marginBottom: 16 }}>🌍</div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 900,
            marginBottom: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--sky))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px',
          }}
        >
          LinguaFlow
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 40, lineHeight: 1.5 }}>
          Tu plataforma completa de inglés A1 → C1
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {['📚 Currículo', '🎧 Listening', '🗣️ Speaking', '🤖 AI Tutor'].map((f) => (
            <span
              key={f}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '5px 12px',
                fontSize: 12,
                color: 'var(--muted)',
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Primary CTA — no account needed */}
        <button
          onClick={handleGuest}
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--sky))',
            border: 'none',
            borderRadius: 14,
            padding: '15px 20px',
            width: '100%',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            marginBottom: 12,
            fontFamily: 'inherit',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
        >
          Comenzar gratis →
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>o</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Google sign-in — syncs progress */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          style={{
            background: googleLoading ? 'var(--surface)' : '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: '13px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: googleLoading ? 'wait' : 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: googleLoading ? 'var(--muted)' : '#1a202c',
            transition: 'box-shadow 0.15s',
            width: '100%',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            if (!googleLoading)
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
          }}
        >
          <GoogleIcon />
          {googleLoading ? 'Conectando…' : 'Continuar con Google'}
        </button>

        {googleError && (
          <p style={{ color: 'var(--coral)', fontSize: 12, marginTop: 10 }}>{googleError}</p>
        )}

        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 24, lineHeight: 1.6 }}>
          Sin cuenta: tu progreso se guarda en este navegador.
          <br />
          Con Google: progreso sincronizado en todos tus dispositivos.
        </p>
      </div>
    </div>
  )
}
