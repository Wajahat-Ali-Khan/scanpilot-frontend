import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import type { AuditResult } from '../../types';

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [recentResults, setRecentResults] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await api.getResults();
        setRecentResults(results.slice(0, 5));

        const completed = results.filter((r) => r.status === 'completed').length;
        setStats({
          total: results.length,
          completed,
          pending: results.length - completed,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const metrics = [
    { label: 'Total Analyses', value: stats.total, color: 'from-blue-600 to-blue-400' },
    { label: 'Completed', value: stats.completed, color: 'from-green-600 to-green-400' },
    { label: 'Pending', value: stats.pending, color: 'from-yellow-600 to-yellow-400' },
    {
      label: 'Success Rate',
      value: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) + '%' : '0%',
      color: 'from-purple-600 to-purple-400',
    },
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {metrics.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
          >
            <div
              className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}
            >
              {metric.value}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Recent Activity</h3>
        {recentResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm sm:text-base">No activity yet. Upload a document to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentResults.map((result, idx) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ x: 8, scale: 1.01 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      result.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
                    }`}
                  />
                  <span className="text-sm sm:text-base text-gray-700">Analysis completed</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  {new Date(result.created_at).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Dashboard;