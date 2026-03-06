"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, icon, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface-1 p-4 stat-shimmer",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-text-2">{label}</span>
        {icon && <span className="text-text-2">{icon}</span>}
      </div>
      <p className={cn("text-2xl font-bold tracking-tight", accent ? "text-accent" : "text-text-0")}>
        {value}
      </p>
    </div>
  );
}

interface WinRateCardProps {
  label: string;
  wins: number;
  losses: number;
  className?: string;
}

export function WinRateCard({ label, wins, losses, className }: WinRateCardProps) {
  const total = wins + losses;
  const rate = total > 0 ? Math.round((wins / total) * 100) : 0;

  return (
    <div className={cn("rounded-xl border border-border bg-surface-1 p-4", className)}>
      <span className="text-[10px] font-medium uppercase tracking-wider text-text-2">{label}</span>
      <div className="flex items-end gap-2 mt-2">
        <p className="text-2xl font-bold text-accent tracking-tight">{rate}%</p>
        <span className="text-xs text-text-2 mb-0.5">{wins}W - {losses}L</span>
      </div>
      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}

interface RecentFormProps {
  label: string;
  results: ("W" | "L")[];
  className?: string;
}

export function RecentFormCard({ label, results, className }: RecentFormProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-1 p-4", className)}>
      <span className="text-[10px] font-medium uppercase tracking-wider text-text-2">{label}</span>
      <div className="flex items-center gap-1 mt-3">
        {results.map((r, i) => (
          <div
            key={i}
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center text-[10px] font-bold",
              r === "W"
                ? "bg-accent/10 text-accent"
                : "bg-live/10 text-live"
            )}
          >
            {r}
          </div>
        ))}
        {results.length === 0 && <span className="text-xs text-text-2">--</span>}
      </div>
    </div>
  );
}
