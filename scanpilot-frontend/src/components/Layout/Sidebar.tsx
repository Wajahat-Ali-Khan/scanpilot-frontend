import { motion } from 'framer-motion';
import { LayoutDashboard, Upload, BarChart3, Settings, X } from 'lucide-react';

import type { PageType } from '../../App';


interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onClose?: () => void;
}

function Sidebar({ currentPage, onNavigate, onClose }: SidebarProps) {
  const menuItems: Array<{ id: PageType; icon: typeof LayoutDashboard; label: string }> = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'upload', icon: Upload, label: 'Upload' },
    { id: 'results', icon: BarChart3, label: 'Results' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-64 lg:w-64 bg-white shadow-xl flex flex-col h-full fixed lg:relative left-0 top-0 lg:top-auto lg:left-auto z-40 lg:z-auto transform lg:translate-x-0 -translate-x-full lg:translate-y-0"
    >
      <div className="p-6 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ScanPilot
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ x: 8, scale: 1.02 }}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
              currentPage === item.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </motion.aside>
  );
}

export default Sidebar;