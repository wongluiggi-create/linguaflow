interface XPBarProps {
  value: number
  max: number
  color?: string
}

export function XPBar({ value, max, color = 'var(--accent)' }: XPBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  return (
    <div style={{ width: '100%', background: 'var(--faint)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: 99,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  )
}
