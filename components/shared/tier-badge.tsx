import { cn } from "@/lib/utils";
import type { TierType } from "@/lib/api/types";

interface TierBadgeProps {
  tier: TierType | null;
}

const styles: Record<string, string> = {
  s: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  a: "bg-slate-400/10 text-slate-300 border-slate-400/20",
  b: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  c: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  d: "bg-zinc-600/10 text-zinc-500 border-zinc-600/20",
};

export function TierBadge({ tier }: TierBadgeProps) {
  if (!tier) return null;
  return (
    <span
      className={cn(
        "inline-flex h-5 w-5 items-center justify-center rounded border text-[10px] font-bold uppercase",
        styles[tier] ?? styles.d
      )}
    >
      {tier}
    </span>
  );
}
