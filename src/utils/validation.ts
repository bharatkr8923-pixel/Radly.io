export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
    };
  }
  return { isValid: true };
}

export function validateRequired(value: string, fieldName: string): string | undefined {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return undefined;
}

export function validateForm<T extends Record<string, any>>(
  values: T,
  rules: Record<keyof T, (value: any) => string | undefined>
): Record<keyof T, string | undefined> {
  const errors = {} as Record<keyof T, string | undefined>;

  for (const key in rules) {
    const error = rules[key](values[key]);
    if (error) {
      errors[key] = error;
    }
  }

  return errors;
}
