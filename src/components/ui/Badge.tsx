import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';
  children: ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-700 border border-secondary-300/50',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-300/50',
    warning: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-300/50',
    error: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-300/50',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-300/50',
    primary: 'bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 border border-primary-300/50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
