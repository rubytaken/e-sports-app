"use client";

import Link from "next/link";
import Image from "next/image";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn, formatDateTime, timeUntil } from "@/lib/utils";
import type { Match, Team } from "@/lib/api/types";

function TeamLogo({ team, side }: { team?: Team; side: "l" | "r" }) {
  return (
    <div className={cn("flex items-center gap-2.5 flex-1 min-w-0", side === "r" && "flex-row-reverse text-right")}>
      <div className="h-8 w-8 shrink-0 rounded-full bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center">
        {team?.image_url ? (
          <Image src={team.image_url} alt={team.name} width={28} height={28} className="object-contain" />
        ) : (
          <span className="text-[10px] font-bold text-text-2">{team?.acronym?.[0] || "?"}</span>
        )}
      </div>
      <span className="text-[13px] font-medium text-text-0 truncate">{team?.name || "TBD"}</span>
    </div>
  );
}

export function MatchCard({ match }: { match: Match }) {
  const t1 = match.opponents?.[0]?.opponent as Team | undefined;
  const t2 = match.opponents?.[1]?.opponent as Team | undefined;
  const s1 = match.results?.[0]?.score ?? 0;
  const s2 = match.results?.[1]?.score ?? 0;
  const isLive = match.status === "running";

  return (
    <Link href={`/matches/${match.id}`}>
      <div
        className={cn(
          "rounded-lg border bg-surface-1 p-4 transition-all card-hover",
          isLive ? "border-live/20" : "border-border hover:border-border-hover"
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <StatusBadge status={match.status} />
          <span className="text-[10px] text-text-2">
            {match.videogame?.name} &middot; BO{match.number_of_games}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <TeamLogo team={t1} side="l" />
          <div className="shrink-0 w-16 text-center">
            {match.status === "not_started" ? (
              <span className="text-[11px] text-text-2">{timeUntil(match.scheduled_at || "")}</span>
            ) : (
              <span className="font-display text-lg font-bold text-text-0 tabular-nums">
                {s1}<span className="text-text-2 mx-0.5">:</span>{s2}
              </span>
            )}
          </div>
          <TeamLogo team={t2} side="r" />
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          {match.league?.image_url && (
            <div className="h-4 w-4 rounded bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center shrink-0">
              <Image src={match.league.image_url} alt="" width={12} height={12} className="object-contain" />
            </div>
          )}
          <span className="text-[10px] text-text-2 truncate">
            {match.league?.name}{match.serie?.full_name ? ` — ${match.serie.full_name}` : ""}
          </span>
          {match.status === "not_started" && match.scheduled_at && (
            <span className="ml-auto text-[10px] text-text-2 shrink-0">{formatDateTime(match.scheduled_at)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
