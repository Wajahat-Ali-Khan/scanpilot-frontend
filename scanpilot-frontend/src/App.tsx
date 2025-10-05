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
import type { User } from './types';


export type PageType = 'landing' | 'dashboard' | 'upload' | 'results' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (api.isAuthenticated()) {
        try {
          const userData = await api.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
          setCurrentPage('dashboard');
        } catch (error) {
          api.logout();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      await api.login({ email, password });
      const userData = await api.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    } catch (error) {
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

          <main className="flex-1 overflow-y-auto">
            <Header
              user={user}
              onLogout={handleLogout}
              onMenuClick={() => setIsMobileMenuOpen(true)}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'upload' && <UploadPage />}
                {currentPage === 'results' && <ResultsPage />}
                {currentPage === 'settings' && <SettingsPage user={user} />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
}