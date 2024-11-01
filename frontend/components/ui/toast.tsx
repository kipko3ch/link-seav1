'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'loading';
  onClose?: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = {
    success: 'bg-green-500/10 border-green-500/50',
    error: 'bg-red-500/10 border-red-500/50',
    loading: 'bg-blue-500/10 border-blue-500/50'
  }[type];

  const textColor = {
    success: 'text-green-500',
    error: 'text-red-500',
    loading: 'text-blue-500'
  }[type];

  const Icon = {
    success: Check,
    error: AlertCircle,
    loading: Loader2
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-lg border backdrop-blur-lg shadow-lg ${bgColor}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${textColor} ${type === 'loading' ? 'animate-spin' : ''}`} />
        <p className={`${textColor} font-medium text-sm`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${textColor} hover:opacity-70 transition-opacity ml-2`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
} 