"use client";

import { Inbox } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState({
  title = "Nothing here",
  description = "Try adjusting your filters.",
  icon,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="h-12 w-12 rounded-2xl bg-surface-2 flex items-center justify-center mb-4">
        {icon || <Inbox size={20} className="text-text-2" />}
      </div>
      <p className="text-sm font-medium text-text-1">{title}</p>
      <p className="text-xs text-text-2 mt-1">{description}</p>
    </motion.div>
  );
}
