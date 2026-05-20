import { HugeiconsIcon } from '@hugeicons/react';
import { Loading01Icon } from '@hugeicons/core-free-icons';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  ref?: React.Ref<HTMLButtonElement>;
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  intent?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
};

const variants = {
  link: {
    danger: 'text-rose-600 hover:underline underline-offset-4 p-0 h-auto focus-visible:ring-rose-500',
    primary: 'text-slate-950 hover:underline underline-offset-4 p-0 h-auto focus-visible:ring-slate-950',
    warning: 'text-amber-600 hover:underline underline-offset-4 p-0 h-auto focus-visible:ring-amber-500',
    secondary: 'text-slate-600 hover:underline underline-offset-4 p-0 h-auto focus-visible:ring-slate-500',
    success: 'text-emerald-600 hover:underline underline-offset-4 p-0 h-auto focus-visible:ring-emerald-500',
  },
  ghost: {
    danger: 'text-rose-700 hover:bg-rose-50 hover:text-rose-800 focus-visible:ring-rose-500',
    warning: 'text-amber-700 hover:bg-amber-50 hover:text-amber-800 focus-visible:ring-amber-500',
    primary: 'text-slate-800 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-slate-950',
    secondary: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-500',
    success: 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:ring-emerald-500',
  },
  solid: {
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm border border-rose-600/10 focus-visible:ring-rose-500',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200/50 focus-visible:ring-slate-500',
    primary: 'bg-slate-950 text-slate-50 hover:bg-slate-900 shadow-sm border border-slate-950/10 focus-visible:ring-slate-950',
    warning: 'bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-sm border border-amber-500/10 focus-visible:ring-amber-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm border border-emerald-600/10 focus-visible:ring-emerald-500',
  },
  outline: {
    danger: 'border border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 focus-visible:ring-rose-500',
    primary: 'border border-slate-300 text-slate-800 hover:bg-slate-50 hover:text-slate-950 focus-visible:ring-slate-950',
    warning: 'border border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 focus-visible:ring-amber-500',
    secondary: 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-500',
    success: 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:ring-emerald-500',
  },
};

/**
 * A highly customizable, accessible, and premium Button component.
 * Supports multiple variants, sizes, intents, icons, and loading states.
 */
export function Button({
  ref,
  children,
  leftIcon,
  disabled,
  rightIcon,
  className,
  size = 'md',
  variant = 'solid',
  isLoading = false,
  fullWidth = false,
  intent = 'primary',
  ...props
}: ButtonProps) {
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  return (
    <button
      ref={ref}
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
        fullWidth && 'w-full',
        sizes[size],
        variants[variant][intent],
        className
      )}
    >
      {isLoading && (       
        <HugeiconsIcon
          icon={Loading01Icon}
          size={iconSize}
          className="animate-spin shrink-0"
        />
      )}
      {!isLoading && leftIcon && (
        <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
}
