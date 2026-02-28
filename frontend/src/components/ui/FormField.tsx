import { clsx } from 'clsx';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface BaseFieldProps {
  label: string;
  error?: string;
}

export function InputField({ label, error, className, ...props }: BaseFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      <input
        className={clsx(
          'focus-ring w-full rounded-lg border border-accentDeep/20 bg-white px-3 py-2 text-sm',
          error && 'border-red-500',
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

export function TextareaField({
  label,
  error,
  className,
  ...props
}: BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      <textarea
        className={clsx(
          'focus-ring w-full rounded-lg border border-accentDeep/20 bg-white px-3 py-2 text-sm',
          error && 'border-red-500',
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  error,
  className,
  children,
  ...props
}: BaseFieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      <select
        className={clsx(
          'focus-ring w-full rounded-lg border border-accentDeep/20 bg-white px-3 py-2 text-sm',
          error && 'border-red-500',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
