import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import Sidebar from './Sidebar';
import { LucideIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../utils/routes';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface MainLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  userName?: string;
  userRole?: string;
}

export default function MainLayout({ children, navItems, userName, userRole }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

      <TopNavigation
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Sidebar
        navItems={navItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="pt-16 lg:pl-64 relative z-10">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
