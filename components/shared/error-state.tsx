"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="h-12 w-12 rounded-2xl bg-live/10 flex items-center justify-center mb-4">
        <AlertTriangle size={20} className="text-live" />
      </div>
      <p className="text-sm font-medium text-text-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-surface-2 px-4 py-2 text-xs font-medium text-text-1 hover:text-text-0 hover:bg-surface-3 transition-colors"
        >
          <RefreshCw size={12} />
          Retry
        </button>
      )}
    </motion.div>
  );
}
