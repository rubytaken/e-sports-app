"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useMatch } from "@/lib/api/matches";
import { StatusBadge } from "@/components/shared/status-badge";
import { TierBadge } from "@/components/shared/tier-badge";
import { PageSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { PageTransition } from "@/components/shared/animated-container";
import { useLocale } from "@/hooks/use-locale";
import { cn, formatDateTime } from "@/lib/utils";
import type { Team } from "@/lib/api/types";

function Side({ team, score, won, align }: { team?: Team; score: number; won: boolean; align: "l" | "r" }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 flex-1", align === "l" ? "md:items-end" : "md:items-start")}>
      <Link href={team ? `/teams/${team.slug}` : "#"} className="group flex flex-col items-center gap-2">
        <div className="h-16 w-16 rounded-2xl bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center">
          {team?.image_url ? (
            <Image src={team.image_url} alt={team.name} width={48} height={48} className="object-contain p-1" />
          ) : (
            <span className="text-lg font-bold text-text-2">{team?.acronym?.[0] || "?"}</span>
          )}
        </div>
        <span className={cn("text-sm font-semibold group-hover:text-accent transition-colors", won ? "text-accent" : "text-text-0")}>
          {team?.name || "TBD"}
        </span>
      </Link>
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={cn("font-display text-4xl font-bold", won ? "text-accent" : "text-text-2")}
      >
        {score}
      </motion.span>
    </div>
  );
}

export default function MatchDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLocale();
  const { data: m, isLoading, isError, refetch } = useMatch(id);

  if (isLoading) return <PageSkeleton />;
  if (isError || !m) return <ErrorState message={t("error")} onRetry={() => refetch()} />;

  const t1 = m.opponents?.[0]?.opponent as Team | undefined;
  const t2 = m.opponents?.[1]?.opponent as Team | undefined;
  const s1 = m.results?.[0]?.score ?? 0;
  const s2 = m.results?.[1]?.score ?? 0;
  const fin = m.status === "finished";
  const w1 = fin && m.winner_id === t1?.id;
  const w2 = fin && m.winner_id === t2?.id;
  const stream = m.streams_list?.find((s) => s.main);

  return (
    <PageTransition>
      <div className="mx-auto max-w-[800px] px-5 py-10">
        <Link href="/matches" className="inline-flex items-center gap-1.5 text-xs text-text-2 hover:text-text-0 transition-colors mb-8">
          <ArrowLeft size={13} /> {t("back")}
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <StatusBadge status={m.status} />
          <TierBadge tier={m.tournament?.tier ?? null} />
          <span className="text-[11px] text-text-2">{m.videogame?.name}</span>
          <span className="text-[11px] text-text-2">BO{m.number_of_games}</span>
          {stream && (
            <a href={stream.raw_url} target="_blank" rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-[11px] text-accent hover:text-accent-hover transition-colors">
              <ExternalLink size={11} /> Watch
            </a>
          )}
        </div>

        {/* VS */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <Side team={t1} score={s1} won={w1} align="l" />
          <span className="text-text-2 text-xs font-medium shrink-0">{t("vs")}</span>
          <Side team={t2} score={s2} won={w2} align="r" />
        </div>

        <div className="h-px bg-border mb-6" />

        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl border border-border bg-surface-1 p-4">
            <p className="text-[10px] text-text-2 uppercase tracking-wider font-medium mb-1.5">{t("schedule")}</p>
            <p className="text-xs text-text-0">{formatDateTime(m.scheduled_at)}</p>
            {m.end_at && <p className="text-[10px] text-text-2 mt-0.5">Ended {formatDateTime(m.end_at)}</p>}
          </div>
          <Link href={`/tournaments/${m.tournament?.id}`} className="rounded-xl border border-border bg-surface-1 p-4 hover:bg-surface-2/60 transition-colors">
            <p className="text-[10px] text-text-2 uppercase tracking-wider font-medium mb-1.5">{t("tournament")}</p>
            <p className="text-xs text-text-0">{m.league?.name}</p>
            <p className="text-[10px] text-text-2 mt-0.5">{m.serie?.full_name} — {m.tournament?.name}</p>
          </Link>
        </div>

        {/* Games */}
        {m.games?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-0 mb-3">{t("games")}</h3>
            <div className="space-y-1.5">
              {m.games.sort((a, b) => a.position - b.position).map((g) => (
                <div key={g.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-1 px-4 py-3">
                  <span className="text-xs text-text-1 font-medium">Game {g.position}</span>
                  <div className="flex items-center gap-2">
                    {g.length != null && <span className="text-[10px] text-text-2">{Math.floor(g.length / 60)}m</span>}
                    <span className={cn(
                      "text-[10px] font-medium rounded-md px-2 py-0.5",
                      g.finished ? "bg-accent/10 text-accent" : g.status === "running" ? "bg-live/10 text-live" : "bg-surface-2 text-text-2"
                    )}>
                      {g.finished ? "Done" : g.status === "running" ? "Live" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
