import { cn } from "@/lib/utils";
import type { MatchStatus } from "@/lib/api/types";

interface StatusBadgeProps {
  status: MatchStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-live">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" />
        Live
      </span>
    );
  }

  const map: Record<string, { label: string; cls: string }> = {
    not_started: { label: "Upcoming", cls: "text-blue" },
    finished: { label: "Finished", cls: "text-text-2" },
    canceled: { label: "Canceled", cls: "text-text-2" },
    postponed: { label: "Postponed", cls: "text-text-2" },
  };

  const { label, cls } = map[status] ?? map.not_started;

  return (
    <span className={cn("text-[11px] font-medium uppercase tracking-wide", cls)}>
      {label}
    </span>
  );
}
