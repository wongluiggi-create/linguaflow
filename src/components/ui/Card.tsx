import React from 'react'

interface CardProps {
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
  color?: string
}

export function Card({ children, onClick, style, color }: CardProps) {
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${hovered && color ? color + '55' : 'var(--border)'}`,
        borderRadius: 14,
        padding: 18,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.2s, transform 0.15s',
        transform: hovered && onClick ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
