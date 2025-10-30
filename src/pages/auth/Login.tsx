import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../utils/routes';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password, role);
      if (role === 'teacher') {
        navigate(ROUTES.TEACHER_DASHBOARD);
      } else {
        navigate(ROUTES.STUDENT_DASHBOARD);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="animate-slide-down">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-primary mb-2 text-center">
          Welcome Back
        </h2>
        <p className="text-secondary-600 text-center mb-8">Sign in to continue your learning journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up">
        {error && (
          <div className="p-4 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-xl text-red-700 text-sm animate-scale-in backdrop-blur-sm">
            {error}
          </div>
        )}
        <div className="space-y-1">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-secondary-700 mb-3">
            I am a
          </label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="student"
                checked={role === 'student'}
                onChange={(e) => setRole(e.target.value as 'teacher' | 'student')}
                className="peer sr-only"
              />
              <div className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-secondary-200 bg-white peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-lg transition-all duration-300 hover:border-primary/50">
                <span className="text-secondary-700 peer-checked:text-primary font-medium">Student</span>
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                value="teacher"
                checked={role === 'teacher'}
                onChange={(e) => setRole(e.target.value as 'teacher' | 'student')}
                className="peer sr-only"
              />
              <div className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-secondary-200 bg-white peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-lg transition-all duration-300 hover:border-primary/50">
                <span className="text-secondary-700 peer-checked:text-primary font-medium">Teacher</span>
              </div>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
          Login
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-secondary-600 animate-fade-in">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary hover:text-primary-600 font-semibold transition-colors">
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}
