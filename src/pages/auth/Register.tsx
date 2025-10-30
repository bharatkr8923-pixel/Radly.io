import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../utils/routes';
import { useAuthStore } from '../../store/authStore';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password, role);
      if (role === 'teacher') {
        navigate(ROUTES.TEACHER_DASHBOARD);
      } else {
        navigate(ROUTES.STUDENT_DASHBOARD);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        <Input
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            I am a
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="student"
                checked={role === 'student'}
                onChange={(e) => setRole(e.target.value as 'teacher' | 'student')}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-secondary-700">Student</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="teacher"
                checked={role === 'teacher'}
                onChange={(e) => setRole(e.target.value as 'teacher' | 'student')}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-secondary-700">Teacher</span>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Register
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary-600">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary hover:text-primary-600 font-medium">
          Login here
        </Link>
      </p>
    </AuthLayout>
  );
}
