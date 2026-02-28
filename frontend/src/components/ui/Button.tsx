import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: ReactNode;
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'focus-ring inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition',
        variant === 'primary' && 'bg-accentDeep text-white hover:bg-accentDeep/90',
        variant === 'outline' && 'border border-accentDeep/30 bg-surface text-accentDeep hover:border-accentDeep/70',
        variant === 'ghost' && 'text-accentDeep hover:bg-accentDeep/10',
        props.disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
