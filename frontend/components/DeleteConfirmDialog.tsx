import { motion } from 'framer-motion';
import { Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  title,
  isDeleting,
  onConfirm,
  onCancel
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800/80 backdrop-blur-lg border border-gray-700/50 rounded-lg p-6 max-w-sm w-full"
      >
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-red-500/10 rounded-full">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Link</h3>
            <p className="text-gray-300 text-sm">
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isDeleting}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {isDeleting ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Deleting...
              </div>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 