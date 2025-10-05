import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, ChevronRight } from 'lucide-react';
import ResultDetailModal from './ResultDetailModal.tsx';
import { api } from '../../services/api';
import type { AuditResult } from '../../types';

function ResultsPage() {
  const [results, setResults] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<AuditResult | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await api.getResults();
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-4 sm:p-6 border-b">
          <h3 className="text-lg sm:text-xl font-semibold">Analysis Results</h3>
        </div>

        {results.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-gray-500">
            <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-base sm:text-lg">No results yet</p>
            <p className="text-xs sm:text-sm mt-2">Upload a document to start analyzing</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                    Preview
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="border-b last:border-b-0 cursor-pointer"
                    onClick={() => setSelectedResult(row)}
                  >
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-base">
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600 line-clamp-1">
                        {row.input_text?.substring(0, 50) || 'Document analysis'}...
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          row.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedResult(row);
                        }}
                      >
                        <ChevronRight size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedResult && (
          <ResultDetailModal result={selectedResult} onClose={() => setSelectedResult(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ResultsPage;