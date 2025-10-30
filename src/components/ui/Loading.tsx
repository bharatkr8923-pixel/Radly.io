import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export default function Loading({ size = 'md', className, text }: LoadingProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 animate-fade-in', className)}>
      <div className="relative">
        <div className={cn('absolute inset-0 bg-gradient-to-r from-blue-600 to-primary rounded-full blur-lg opacity-50 animate-pulse', sizes[size])}></div>
        <Loader2 className={cn('animate-spin text-primary relative z-10', sizes[size])} />
      </div>
      {text && <p className="text-sm font-medium text-secondary-600 animate-pulse">{text}</p>}
    </div>
  );
}
