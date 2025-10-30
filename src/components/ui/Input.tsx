import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 border-2 rounded-xl text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white/50 backdrop-blur-sm',
            error ? 'border-red-500 focus:ring-red-100' : 'border-secondary-200 hover:border-secondary-300',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 animate-slide-down">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
