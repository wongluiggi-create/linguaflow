import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  color?: string
  outline?: boolean
  disabled?: boolean
  full?: boolean
  sm?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function Button({ children, onClick, color = 'var(--accent)', outline, disabled, full, sm, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: outline ? 'transparent' : color,
        border: `1.5px solid ${outline ? color : 'transparent'}`,
        color: outline ? color : '#fff',
        borderRadius: 10,
        padding: sm ? '6px 14px' : '10px 22px',
        fontSize: sm ? 13 : 15,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: full ? '100%' : undefined,
        transition: 'opacity 0.15s, transform 0.1s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      {children}
    </button>
  )
}
