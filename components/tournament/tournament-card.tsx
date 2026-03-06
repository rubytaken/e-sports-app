"use client";

import Link from "next/link";
import Image from "next/image";
import { TierBadge } from "@/components/shared/tier-badge";
import { formatDate } from "@/lib/utils";
import type { Tournament } from "@/lib/api/types";

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <Link href={`/tournaments/${tournament.id}`}>
      <div className="rounded-lg border border-border bg-surface-1 p-4 transition-all card-hover hover:border-border-hover">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 shrink-0 rounded-md bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center">
              {tournament.league?.image_url ? (
                <Image src={tournament.league.image_url} alt="" width={22} height={22} className="object-contain" />
              ) : (
                <span className="text-[10px] font-bold text-text-2">{tournament.league?.name?.[0]}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-text-2 uppercase tracking-wide">{tournament.videogame?.name}</p>
              <p className="text-xs text-text-1 truncate">{tournament.league?.name}</p>
            </div>
          </div>
          <TierBadge tier={tournament.tier} />
        </div>

        <h3 className="text-[13px] font-semibold text-text-0 leading-snug mb-1 line-clamp-2">
          {tournament.name}
        </h3>
        <p className="text-[10px] text-text-2 mb-3">{tournament.serie?.full_name}</p>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-2">
            {formatDate(tournament.begin_at)}
            {tournament.end_at ? ` — ${formatDate(tournament.end_at)}` : ""}
          </span>
          {tournament.prizepool && (
            <span className="text-[10px] font-medium text-accent">{tournament.prizepool}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
