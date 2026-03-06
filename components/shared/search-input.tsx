"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-md border border-border bg-surface-1 pl-8 pr-8 text-xs text-text-0 placeholder:text-text-2 outline-none focus:border-accent/40 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-2 hover:text-text-0 transition-colors p-0.5 rounded hover:bg-surface-2"
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
