import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface SidebarProps {
  navItems: NavItem[];
  isOpen: boolean;
  onClose?: () => void;
}

export default function Sidebar({ navItems, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-secondary-200 z-40 transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-secondary-700 hover:bg-secondary-100'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
