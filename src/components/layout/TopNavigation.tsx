import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';

interface TopNavigationProps {
  userName?: string;
  userRole?: string;
  onLogout: () => void;
  onMenuClick?: () => void;
}

export default function TopNavigation({
  userName,
  userRole,
  onLogout,
  onMenuClick,
}: TopNavigationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-secondary-200 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-secondary-700" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-secondary-900 font-heading">
              Radly.io
            </span>
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-3 py-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-secondary-900">{userName}</p>
              <p className="text-xs text-secondary-600 capitalize">{userRole}</p>
            </div>
            <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-700" />
            </div>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-20">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
