import './index.css';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LandingPage from './components/Landing/LandingPage';
import Dashboard from './components/Dashboard/Dashboard';
import UploadPage from './components/Upload/UploadPage';
import ResultsPage from './components/Results/ResultsPage';
import SettingsPage from './components/Settings/SettingsPage';
import { api } from './services/api';
import FilesPage from './components/Files/filesPage';
import type { User } from './types';


export type PageType = 'landing' | 'dashboard' | 'upload' | 'files' | 'results' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
  const checkAuth = async () => {
    // Clear any invalid tokens on app start
    const token = localStorage.getItem('access_token');
    if (token) {
      // Basic token validation
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          // Invalid token format
          api.logout();
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
      } catch {
        api.logout();
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
    }

    if (api.isAuthenticated()) {
      try {
        const userData = await api.getProfile();
        setUser(userData);
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
      } catch (error) {
        console.error('Auth check failed:', error);
        api.logout();
        setIsAuthenticated(false);
        setCurrentPage('landing');
      }
    }
    setLoading(false);
  };

  checkAuth();
}, []);

const handleLogin = async (email: string, password: string) => {
  try {
    api.logout();
    
    const tokenResponse = await api.login({ email, password });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const userData = await api.getProfile();
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  } catch (error) {
    api.logout();
    setIsAuthenticated(false);
    throw error;
  }
};

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('landing');
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {!isAuthenticated ? (
        <LandingPage onLogin={handleLogin} />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <div className="hidden lg:block">
            <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="fixed inset-y-0 left-0 z-50 lg:hidden"
                >
                  <Sidebar
                    currentPage={currentPage}
                    onNavigate={handleNavigate}
                    onClose={() => setIsMobileMenuOpen(false)}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <main className="flex-1 flex flex-col min-w-0">
            <Header
              user={user}
              onLogout={handleLogout}
              onMenuClick={() => setIsMobileMenuOpen(true)}
            />
            
            {/* Add proper padding container */}
            <div className="flex-1 overflow-y-auto pt-16"> {/* Added pt-16 for header spacing */}
              <div className="p-4 sm:p-6 lg:p-8"> {/* Consistent padding container */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[calc(100vh-8rem)]" // Ensure minimum height
                  >
                    {currentPage === 'dashboard' && <Dashboard />}
                    {currentPage === 'upload' && <UploadPage onUploadSuccess={() => setCurrentPage('files')} />}
                    {currentPage === 'files' && <FilesPage />}
                    {currentPage === 'results' && <ResultsPage />}
                    {currentPage === 'settings' && <SettingsPage user={user} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}