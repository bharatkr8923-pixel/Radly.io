import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-secondary-300 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-secondary-900 mb-2">Page Not Found</h2>
        <p className="text-secondary-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/')}>
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
