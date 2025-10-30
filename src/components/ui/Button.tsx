import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95 shadow-lg hover:shadow-xl';

    const variants = {
      primary: 'bg-gradient-to-br from-blue-600 to-primary text-white hover:from-blue-700 hover:to-primary-600 shadow-blue-500/30 hover:shadow-blue-500/50',
      secondary: 'bg-gradient-to-br from-secondary-100 to-secondary-200 text-secondary-800 hover:from-secondary-200 hover:to-secondary-300 shadow-secondary-300/30',
      outline: 'border-2 border-primary/80 text-primary hover:bg-primary/10 hover:border-primary shadow-primary/20 backdrop-blur-sm',
      ghost: 'text-secondary-700 hover:bg-secondary-100/80 hover:text-secondary-900 shadow-none hover:shadow-md',
      danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-500/30 hover:shadow-red-500/50',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-13 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
