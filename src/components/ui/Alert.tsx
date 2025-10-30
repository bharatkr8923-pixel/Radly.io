import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  className?: string;
}

export default function Alert({ variant = 'info', children, className }: AlertProps) {
  const variants = {
    success: {
      container: 'bg-accent-50 border-accent-200 text-accent-800',
      icon: CheckCircle,
      iconColor: 'text-accent-500',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: XCircle,
      iconColor: 'text-red-500',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
    },
    info: {
      container: 'bg-primary-50 border-primary-200 text-primary-800',
      icon: Info,
      iconColor: 'text-primary-500',
    },
  };

  const { container, icon: Icon, iconColor } = variants[variant];

  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-lg border', container, className)}>
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColor)} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
