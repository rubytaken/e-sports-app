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
      <div className="h-14 w-14 rounded-2xl bg-live/10 ring-1 ring-live/20 flex items-center justify-center mb-4">
        <AlertTriangle size={22} className="text-live" />
      </div>
      <p className="text-sm font-semibold text-text-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-surface-2 border border-border px-5 py-2.5 text-xs font-medium text-text-1 hover:text-text-0 hover:bg-surface-3 transition-all"
        >
          <RefreshCw size={12} />
          Retry
        </button>
      )}
    </motion.div>
  );
}
