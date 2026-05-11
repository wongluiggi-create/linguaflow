import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { signInWithGoogle } = useAuth()

  async function handleGoogle() {
    await signInWithGoogle()
    // useAuth listener will handle store + navigation
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
        <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 48, lineHeight: 1.5 }}>
          Tu plataforma completa de inglés A1 → C1
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {['📚 Currículo completo', '🎧 Listening', '🎤 Speaking', '🤖 AI Tutor'].map((f) => (
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

        {/* Auth buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleGoogle}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: '13px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 600,
              color: '#1a202c',
              transition: 'box-shadow 0.15s',
              width: '100%',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none' }}
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          <Button onClick={handleGuest} full outline>
            Continuar sin cuenta
          </Button>
        </div>

        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 24, lineHeight: 1.6 }}>
          Al continuar aceptas nuestros términos de uso.
          <br />
          Tu progreso se guarda automáticamente con una cuenta.
        </p>
      </div>
    </div>
  )
}
