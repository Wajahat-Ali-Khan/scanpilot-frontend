import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { api } from '../../services/api';
import type { User } from '../../types';

interface SettingsPageProps {
  user: User | null;
}

function SettingsPage({ user }: SettingsPageProps) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    password: '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const updateData: any = {
        full_name: formData.full_name || undefined,
        email: formData.email || undefined,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await api.updateProfile(updateData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      setFormData({ ...formData, password: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Account Settings</h3>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
          >
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              placeholder="••••••••"
              minLength={8}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
          >
            {saved ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Saved!
              </motion.span>
            ) : loading ? (
              'Saving...'
            ) : (
              'Save Changes'
            )}
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Account ID:</span>
            <span className="font-mono text-gray-800 text-xs sm:text-sm">
              {user?.id ? `#${user.id.toString().padStart(6, '0')}` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Member since:</span>
            <span className="text-gray-800">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SettingsPage;