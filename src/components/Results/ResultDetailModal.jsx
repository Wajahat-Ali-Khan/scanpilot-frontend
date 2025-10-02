import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Download } from 'lucide-react';

// Result Detail Modal Component 
function ResultDetailModal({ result, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Analysis Results</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Input Text</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {result.input_text || 'No preview available'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Analysis</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-800 whitespace-pre-wrap">
                {result.result_json?.analysis || 'Analysis in progress...'}
              </p>
            </div>
          </div>

          {result.result_json?.suggestions && result.result_json.suggestions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Suggestions</h3>
              <div className="space-y-2">
                {result.result_json.suggestions.map((suggestion, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                  >
                    <Check className="text-green-600 flex-shrink-0 mt-1" size={18} />
                    <span className="text-gray-700">{suggestion}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {result.result_json?.quality_score && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Quality Score</h3>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-blue-600">
                  {result.result_json.quality_score}/10
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.result_json.quality_score / 10) * 100}%` }}
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Analyzed on {new Date(result.created_at).toLocaleString()}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ResultDetailModal;