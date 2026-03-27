"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col items-center gap-3 pt-8">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-text-2 hover:text-text-0 hover:bg-surface-2 hover:border-border-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-xs text-text-2">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-lg text-xs font-semibold transition-all",
                p === currentPage
                  ? "bg-accent text-white shadow-sm shadow-accent/20"
                  : "border border-border text-text-2 hover:text-text-0 hover:bg-surface-2 hover:border-border-hover"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-text-2 hover:text-text-0 hover:bg-surface-2 hover:border-border-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {totalItems !== undefined && totalItems > 0 && (
        <p className="text-[10px] text-text-2">
          {totalItems} total results
        </p>
      )}
    </div>
  );
}
