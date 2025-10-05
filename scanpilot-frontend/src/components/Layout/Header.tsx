import type { User } from '../../types';
import { Menu, LogOut } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onMenuClick: () => void;
}

function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm px-4 sm:px-6 py-3 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
            <span className="hidden sm:inline">
              Welcome back, {user?.full_name || user?.email?.split('@')[0] || 'User'}!
            </span>
            <span className="sm:hidden">Dashboard</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
              {user?.email}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;