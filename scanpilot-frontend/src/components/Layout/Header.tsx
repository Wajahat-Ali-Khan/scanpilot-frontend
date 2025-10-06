// Replace your Header.tsx with this:
import type { User } from '../../types';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onMenuClick: () => void;
}

function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </motion.button>
          <motion.h2 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-2xl font-bold text-gray-800"
          >
            <span className="hidden sm:inline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.full_name || user?.email?.split('@')[0] || 'User'}!
            </span>
            <span className="sm:hidden bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ScanPilot
            </span>
          </motion.h2>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <UserIcon size={16} className="text-white" />
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700 truncate max-w-[160px]">
                {user?.full_name || 'User'}
              </div>
              <div className="text-xs text-gray-500 truncate max-w-[160px]">
                {user?.email}
              </div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </motion.button>
        </div>
      </div>
    </header>
  );
}

export default Header;