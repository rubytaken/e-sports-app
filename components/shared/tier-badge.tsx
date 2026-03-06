import { cn } from "@/lib/utils";
import type { TierType } from "@/lib/api/types";

interface TierBadgeProps {
  tier: TierType | null;
}

const styles: Record<string, string> = {
  s: "bg-tier-s/15 text-tier-s border-tier-s/30 shadow-tier-s/10",
  a: "bg-tier-a/15 text-tier-a border-tier-a/30",
  b: "bg-tier-b/15 text-tier-b border-tier-b/30",
  c: "bg-surface-2 text-text-2 border-border",
  d: "bg-surface-2 text-text-2 border-border",
};

export function TierBadge({ tier }: TierBadgeProps) {
  if (!tier) return null;
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-lg border text-[10px] font-extrabold uppercase shadow-sm",
        styles[tier] ?? styles.d
      )}
    >
      {tier}
    </span>
  );
}
