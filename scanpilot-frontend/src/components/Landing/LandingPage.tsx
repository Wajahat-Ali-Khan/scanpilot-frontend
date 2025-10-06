import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../Auth/AuthModal';

interface LandingPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

function LandingPage({ onLogin }: LandingPageProps) {
  const [showAuth, setShowAuth] = useState(false);

  return (
  <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            ScanPilot
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAuth(true)}
            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Sign In
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={onLogin} />}
      </AnimatePresence>

      {/* // In LandingPage.tsx, update the main section: */}
      <section className="pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Transform Your Documents
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Powerful AI-driven document analysis. Upload, analyze, and get intelligent insights in seconds.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAuth(true)}
            className="px-5 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-shadow mx-auto"
          >
            Start Free Trial
          </motion.button>
        </div>
      </section>


      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {[
            {
              title: 'AI-Powered Analysis',
              desc: 'Advanced NLP models analyze your documents',
              delay: 0,
            },
            {
              title: 'Instant Insights',
              desc: 'Get suggestions and improvements in real-time',
              delay: 0.2,
            },
            {
              title: 'Secure Storage',
              desc: 'Enterprise-grade security for your data',
              delay: 0.4,
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-5 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow w-full"
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LandingPage;