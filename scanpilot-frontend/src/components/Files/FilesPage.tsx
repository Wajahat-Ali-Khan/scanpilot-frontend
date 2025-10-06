import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Play,
  Trash2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import type { UploadWithStatus } from '../../types';

export default function FilesPage() {
  const [files, setFiles] = useState<UploadWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setError('');
      const data = await api.getAllUploads();
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (fileId: string) => {
    setProcessingFiles((prev) => new Set(prev).add(fileId));
    setError('');

    try {
      await api.processFile({ upload_id: fileId });
      
      // Poll for status updates
      const pollInterval = setInterval(async () => {
        try {
          const updatedFile = await api.getUploadById(fileId);
          setFiles((prev) =>
            prev.map((f) => (f.id === fileId ? updatedFile : f))
          );

          if (updatedFile.status === 'completed' || updatedFile.status === 'failed') {
            clearInterval(pollInterval);
            setProcessingFiles((prev) => {
              const newSet = new Set(prev);
              newSet.delete(fileId);
              return newSet;
            });
          }
        } catch (err) {
          clearInterval(pollInterval);
          setProcessingFiles((prev) => {
            const newSet = new Set(prev);
            newSet.delete(fileId);
            return newSet;
          });
        }
      }, 2000);

      // Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        setProcessingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }, 120000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setProcessingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await api.deleteUpload(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'processing':
        return <Loader className="text-blue-500 animate-spin" size={20} />;
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'failed':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <FileText className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Files</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchFiles}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={18} />
          <span className="hidden sm:inline">Refresh</span>
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
        >
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <span className="text-sm text-red-800">{error}</span>
        </motion.div>
      )}

      {files.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-white rounded-xl shadow-lg"
        >
          <FileText size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No files uploaded yet</h3>
          <p className="text-gray-500">Upload a file to get started with analysis</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {files.map((file, idx) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <FileText className="text-blue-600 flex-shrink-0" size={32} />
                  {getStatusIcon(file.status)}
                </div>

                <h3 className="font-semibold text-gray-800 mb-2 truncate" title={file.original_filename}>
                  {file.original_filename}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Size:</span>
                    <span className="font-medium">{(file.file_size / 1024).toFixed(2)} KB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Uploaded:</span>
                    <span className="font-medium">
                      {new Date(file.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getStatusColor(file.status)}`}>
                  {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                </div>

                {file.error_message && (
                  <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                    {file.error_message}
                  </div>
                )}

                <div className="flex gap-2">
                  {file.status === 'pending' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleProcess(file.id)}
                      disabled={processingFiles.has(file.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingFiles.has(file.id) ? (
                        <>
                          <Loader className="animate-spin" size={16} />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          <span>Process</span>
                        </>
                      )}
                    </motion.button>
                  )}

                  {file.status === 'failed' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleProcess(file.id)}
                      disabled={processingFiles.has(file.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={16} />
                      <span>Retry</span>
                    </motion.button>
                  )}

                  {file.status === 'processing' && (
                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                      <Loader className="animate-spin" size={16} />
                      <span>Processing...</span>
                    </div>
                  )}

                  {file.status === 'completed' && (
                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                      <CheckCircle size={16} />
                      <span>Completed</span>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(file.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete file"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}