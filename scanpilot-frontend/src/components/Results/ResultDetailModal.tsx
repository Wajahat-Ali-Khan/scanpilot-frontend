import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, Check, Download, Loader2 } from 'lucide-react';
import type { AuditResult } from '../../types';
import html2pdf from 'html2pdf.js';

interface ResultDetailModalProps {
  result: AuditResult;
  onClose: () => void;
}

function ResultDetailModal({ result, onClose }: ResultDetailModalProps) {
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleExportPDF = async () => {
    setGeneratingPDF(true);
    
    try {
      // Create a temporary element with the content
      const tempElement = document.createElement('div');
      tempElement.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #2563eb; margin-bottom: 5px;">Analysis Report - ScanPilot</h1>
          <p style="color: #666; font-size: 12px; margin-bottom: 20px;">
            Generated on: ${new Date(result.created_at).toLocaleString()}
          </p>
          
          <h2 style="color: #374151; font-size: 16px; margin-bottom: 10px;">Input Text</h2>
          <p style="background: #f9fafb; padding: 15px; border-radius: 8px; font-size: 12px; line-height: 1.5; white-space: pre-wrap;">
            ${result.input_text || 'No preview available'}
          </p>
          
          <h2 style="color: #374151; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">Analysis</h2>
          <div style="background: #dbeafe; padding: 15px; border-radius: 8px; font-size: 12px; line-height: 1.5; white-space: pre-wrap;">
            ${result.result_json?.analysis || 'Analysis in progress...'}
          </div>
          
          ${result.result_json?.suggestions && result.result_json.suggestions.length > 0 ? `
            <h2 style="color: #374151; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">Suggestions</h2>
            <div style="font-size: 12px;">
              ${result.result_json.suggestions.map(suggestion => `
                <div style="background: #dcfce7; padding: 10px; margin-bottom: 8px; border-radius: 6px; display: flex; align-items: start; gap: 10px;">
                  <span style="color: #16a34a;">✓</span>
                  <span style="white-space: pre-wrap;">${suggestion}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          ${result.result_json?.quality_score ? `
            <h2 style="color: #374151; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">Quality Score</h2>
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="font-size: 24px; font-weight: bold; color: #2563eb;">
                ${result.result_json.quality_score}/10
              </div>
              <div style="flex: 1; height: 12px; background: #e5e7eb; border-radius: 6px; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, #2563eb, #7c3aed); width: ${(result.result_json.quality_score / 10) * 100}%"></div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
      
      document.body.appendChild(tempElement);
      
      // PDF options - Fixed TypeScript issues
      const options = {
        margin: 10,
        filename: `analysis-result-${result.id || Date.now()}.pdf`,
        image: { 
          type: 'jpeg' as const, // Fixed: explicitly type as 'jpeg'
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true
        },
        jsPDF: { 
          unit: 'mm' as const, 
          format: 'a4' as const, 
          orientation: 'portrait' as const 
        }
      };
      
      // Generate PDF - Fixed method chaining
      await html2pdf().from(tempElement).set(options).save();
      
      // Remove temporary element
      document.body.removeChild(tempElement);
      
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-result-${result.id || Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold">Analysis Results</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2">
              Input Text
            </h3>
            <p className="text-sm sm:text-base text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
              {result.input_text+'....' || 'No preview available'}
            </p>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2">
              Analysis
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap">
                {result.result_json?.analysis || 'Analysis in progress...'}
              </p>
            </div>
          </div>

          {result.result_json?.suggestions && result.result_json.suggestions.length > 0 && (
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2">
                Suggestions
              </h3>
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
                    <span className="text-sm sm:text-base text-gray-700">{suggestion}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {result.result_json?.quality_score && (
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-2">
                Quality Score
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">
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

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
            <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              Analyzed on {new Date(result.created_at).toLocaleString()}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportJSON}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Export JSON
              </motion.button>
              <motion.button
                whileHover={{ scale: generatingPDF ? 1 : 1.05 }}
                whileTap={{ scale: generatingPDF ? 1 : 0.95 }}
                onClick={handleExportPDF}
                disabled={generatingPDF}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingPDF ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Download size={18} />
                )}
                {generatingPDF ? 'Generating...' : 'Export PDF'}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ResultDetailModal;
