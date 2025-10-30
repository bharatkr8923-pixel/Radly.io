import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../utils/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'teacher' | 'student';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const redirectTo = user.role === 'teacher' ? ROUTES.TEACHER_DASHBOARD : ROUTES.STUDENT_DASHBOARD;
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
