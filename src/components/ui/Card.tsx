import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-sm rounded-2xl border border-secondary-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('px-6 py-5 border-b border-secondary-200/50 bg-gradient-to-r from-secondary-50/50 to-transparent', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div className={cn('px-6 py-5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('px-6 py-5 border-t border-secondary-200/50 bg-gradient-to-r from-secondary-50/50 to-transparent', className)}
      {...props}
    >
      {children}
    </div>
  );
}
