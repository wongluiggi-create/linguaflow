interface PillProps {
  label: string
  color?: string
  small?: boolean
}

export function Pill({ label, color = 'var(--accent)', small }: PillProps) {
  return (
    <span
      style={{
        background: color + '22',
        color,
        border: `1px solid ${color}44`,
        borderRadius: 20,
        padding: small ? '2px 8px' : '4px 12px',
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        display: 'inline-block',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </span>
  )
}
