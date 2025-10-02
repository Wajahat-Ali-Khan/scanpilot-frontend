import React, { useState, useEffect } from 'react';
import './index.css';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/Landing/LandingPage.jsx';
import Sidebar from './components/Layout/Sidebar.jsx';
import Header from './components/Layout/Header.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import UploadPage from './components/Upload/UploadPage.jsx';
import ResultsPage from './components/Results/ResultsPage.jsx';
import SettingsPage from './components/Settings/SettingsPage.jsx';
import { api } from './services/api.js';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (api.auth.isAuthenticated()) {
        try {
          const userData = await api.users.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
          setCurrentPage('dashboard');
        } catch (error) {
          api.auth.logout();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await api.auth.login(email, password);
      const userData = await api.users.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('landing');
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
      {/* Debug banner: temporary — remove after verification */}
      <div id="tailwind-debug-banner" className="p-3 bg-red-500 text-white text-center font-semibold" style={{ backgroundColor: 'red', color: 'white' }}>
        TAILWIND DEBUG BANNER — should be red (inline style test)
      </div>
      {!isAuthenticated ? (
        <LandingPage onNavigate={setCurrentPage} onLogin={handleLogin} currentPage={currentPage} />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
          <main className="flex-1 overflow-y-auto">
            <Header user={user} onLogout={handleLogout} />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentPage === 'dashboard' && <Dashboard user={user} />}
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