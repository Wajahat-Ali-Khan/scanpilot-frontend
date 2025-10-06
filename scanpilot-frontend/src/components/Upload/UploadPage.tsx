import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertCircle, Check } from 'lucide-react';
import { api } from '../../services/api';
import type { UploadResponse } from '../../types';

interface UploadPageProps {
  onUploadSuccess?: () => void;
}

function UploadPage({ onUploadSuccess }: UploadPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 200);

      const result = await api.uploadFile(file);

      clearInterval(progressInterval);
      setProgress(100);
      setUploadedFile(result);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setUploading(false);
        setProgress(0);
        
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setProgress(0);
    }
  };

  // FIX: Properly typed handleDrop function
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How it works:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Upload your file here (PDF, DOCX, or TXT)</li>
              <li>Go to "My Files" to view uploaded files</li>
              <li>Click "Process" to analyze your document</li>
              <li>View results in the "Results" page</li>
            </ol>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        className={`border-4 border-dashed rounded-2xl p-8 sm:p-16 text-center transition-all ${
          isDragging ? 'border-blue-600 bg-blue-50 scale-105' : 'border-gray-300 bg-white'
        }`}
      >
        <Upload size={48} className="mx-auto mb-4 text-gray-400 sm:w-16 sm:h-16" />
        <h3 className="text-xl sm:text-2xl font-semibold mb-2">Drop files here</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-2">or click to browse</p>
        <p className="text-xs sm:text-sm text-gray-500 mb-6">Supported: PDF, DOCX, TXT (max 10MB)</p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.docx,.doc,.txt"
          onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
        />
        <motion.label
          htmlFor="file-upload"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 cursor-pointer text-sm sm:text-base"
        >
          Select Files
        </motion.label>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 sm:mt-6 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <span className="text-sm sm:text-base text-red-800 font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm sm:text-base font-medium">Uploading...</span>
              <span className="text-sm sm:text-base text-gray-600">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 sm:mt-6 bg-green-50 border border-green-200 p-4 sm:p-6 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Check className="text-green-600" size={24} />
              </motion.div>
              <span className="text-sm sm:text-base text-green-800 font-medium">
                File uploaded successfully! Redirecting to My Files...
              </span>
            </div>
            <div className="text-xs sm:text-sm text-green-700">
              <p>
                <strong>Filename:</strong> {uploadedFile.original_filename}
              </p>
              <p>
                <strong>Size:</strong> {(uploadedFile.file_size / 1024).toFixed(2)} KB
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UploadPage;
