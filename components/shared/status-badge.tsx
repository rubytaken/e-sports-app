import { cn } from "@/lib/utils";
import type { MatchStatus } from "@/lib/api/types";

interface StatusBadgeProps {
  status: MatchStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-live/10 border border-live/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-live">
        <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" />
        Live
      </span>
    );
  }

  const map: Record<string, { label: string; cls: string }> = {
    not_started: { label: "Upcoming", cls: "bg-blue/10 border-blue/20 text-blue" },
    finished: { label: "Finished", cls: "bg-surface-2 border-border text-text-2" },
    canceled: { label: "Canceled", cls: "bg-surface-2 border-border text-text-2" },
    postponed: { label: "Postponed", cls: "bg-surface-2 border-border text-text-2" },
  };

  const { label, cls } = map[status] ?? map.not_started;

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", cls)}>
      {label}
    </span>
  );
}
