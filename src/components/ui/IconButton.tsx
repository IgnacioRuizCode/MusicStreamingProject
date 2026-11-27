import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: 'default' | 'filled' | 'outline'
  children: ReactNode
}

export function IconButton({
  label,
  variant = 'default',
  type = 'button',
  className = '',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`icon-btn icon-btn--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
