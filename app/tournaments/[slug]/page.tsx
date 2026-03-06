"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ClipboardEdit } from "lucide-react";
import { motion } from "framer-motion";
import {
  useTournament, useTournamentStandings, useTournamentMatches,
  useTournamentTeams, useTournamentBrackets,
} from "@/lib/api/tournaments";
import { TierBadge } from "@/components/shared/tier-badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { MatchCard } from "@/components/match/match-card";
import { PageSkeleton, TableSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTransition } from "@/components/shared/animated-container";
import { useLocale } from "@/hooks/use-locale";
import { cn, formatDate } from "@/lib/utils";
import type { Team, MatchStatus } from "@/lib/api/types";

const tabs = ["Standings", "Matches", "Teams", "Bracket"] as const;

export default function TournamentDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useLocale();
  const [tab, setTab] = useState<string>("Standings");

  const { data: tournament, isLoading, isError, refetch } = useTournament(slug);
  const standings = useTournamentStandings(slug);
  const matches = useTournamentMatches(slug);
  const teams = useTournamentTeams(slug);
  const brackets = useTournamentBrackets(slug, tab === "Bracket" && (tournament?.has_bracket ?? false));

  if (isLoading) return <PageSkeleton />;
  if (isError || !tournament) return <ErrorState message="Failed to load tournament." onRetry={() => refetch()} />;

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <Link href="/tournaments" className="inline-flex items-center gap-1.5 text-xs text-text-2 hover:text-text-0 transition-colors mb-8">
          <ArrowLeft size={13} /> {t("back")}
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {tournament.league?.image_url && (
              <div className="h-16 w-16 shrink-0 rounded-xl bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center">
                <Image src={tournament.league.image_url} alt="" width={44} height={44} className="object-contain" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <TierBadge tier={tournament.tier} />
                <span className="text-[10px] text-text-2">{tournament.videogame?.name}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-0">{tournament.name}</h1>
              <p className="text-xs text-text-2 mt-0.5">{tournament.league?.name} — {tournament.serie?.full_name}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-text-2">
                <span>{formatDate(tournament.begin_at)} — {formatDate(tournament.end_at)}</span>
                {tournament.prizepool && <span className="text-accent font-medium">{tournament.prizepool}</span>}
              </div>
            </div>

            {/* Register Button */}
            <Link
              href={`/tournaments/${slug}/register`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-xs font-medium text-white hover:bg-accent-hover transition-colors shrink-0 mt-2 sm:mt-0"
            >
              <ClipboardEdit size={14} />
              {t("register_now")}
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border pb-px overflow-x-auto">
          {tabs.map((label) => {
            if (label === "Bracket" && !tournament.has_bracket) return null;
            return (
              <button key={label} onClick={() => setTab(label)}
                className={cn(
                  "rounded-t-md px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap",
                  tab === label
                    ? "bg-surface-2 text-text-0 border-b-2 border-accent"
                    : "text-text-2 hover:text-text-1"
                )}>
                {label === "Standings" ? t("standings") :
                 label === "Matches" ? t("matches_tab") :
                 label === "Teams" ? t("teams_tab") :
                 t("bracket")}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Standings */}
          {tab === "Standings" && (
            standings.isLoading ? <TableSkeleton rows={8} /> :
            standings.data?.length ? (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-1 text-[10px] text-text-2 uppercase tracking-wide">
                      <th className="text-left py-3 px-4 w-10">#</th>
                      <th className="text-left py-3 px-4">{t("teams_tab")}</th>
                      <th className="text-center py-3 px-4 w-14">{t("wins")}</th>
                      <th className="text-center py-3 px-4 w-14">{t("losses")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.data.map((s, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-surface-1 transition-colors">
                        <td className={cn("py-3 px-4 font-semibold", s.rank <= 3 ? "text-accent" : "text-text-2")}>{s.rank}</td>
                        <td className="py-3 px-4">
                          {s.team ? (
                            <Link href={`/teams/${s.team.slug}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                              <div className="h-6 w-6 rounded bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center shrink-0">
                                {s.team.image_url ? <Image src={s.team.image_url} alt="" width={18} height={18} className="object-contain" /> :
                                  <span className="text-[8px] font-bold text-text-2">{s.team.acronym?.[0]}</span>}
                              </div>
                              <span className="text-text-0 font-medium">{s.team.name}</span>
                            </Link>
                          ) : <span className="text-text-2">TBD</span>}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-accent">{s.wins}</td>
                        <td className="py-3 px-4 text-center font-semibold text-live">{s.losses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <EmptyState title={t("standings")} description={t("nothing_here")} />
          )}

          {/* Matches */}
          {tab === "Matches" && (
            matches.isLoading ? <TableSkeleton /> :
            matches.data?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matches.data.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            ) : <EmptyState title={t("matches_tab")} description={t("nothing_here")} />
          )}

          {/* Teams */}
          {tab === "Teams" && (
            teams.isLoading ? <TableSkeleton /> :
            teams.data?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {teams.data.map((team) => (
                  <Link key={team.id} href={`/teams/${team.slug}`}>
                    <div className="rounded-xl border border-border bg-surface-1 p-4 text-center card-hover hover:border-border-hover">
                      <div className="h-10 w-10 mx-auto rounded-md bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center mb-2">
                        {team.image_url ? <Image src={team.image_url} alt="" width={32} height={32} className="object-contain" /> :
                          <span className="text-[10px] font-bold text-text-2">{team.acronym?.[0]}</span>}
                      </div>
                      <p className="text-xs font-medium text-text-0 truncate">{team.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : <EmptyState title={t("teams_tab")} description={t("nothing_here")} />
          )}

          {/* Bracket */}
          {tab === "Bracket" && (
            brackets.isLoading ? <TableSkeleton rows={6} /> :
            (brackets.data as any[])?.length ? (
              <div className="space-y-2">
                {(brackets.data as any[]).sort((a: any, b: any) => a.position - b.position).map((b: any) => {
                  const bt1 = b.match?.opponents?.[0]?.opponent as Team | undefined;
                  const bt2 = b.match?.opponents?.[1]?.opponent as Team | undefined;
                  const bs1 = b.match?.results?.[0]?.score ?? 0;
                  const bs2 = b.match?.results?.[1]?.score ?? 0;
                  return (
                    <div key={b.match_id} className="rounded-lg border border-border bg-surface-1 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-text-2 font-medium">{b.match?.name || `Match ${b.position}`}</span>
                        <StatusBadge status={b.match?.status as MatchStatus} />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between rounded-md bg-surface-0 px-3 py-2">
                          <div className="flex items-center gap-2">
                            {bt1?.image_url && (
                              <div className="h-5 w-5 rounded bg-logo-bg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center">
                                <Image src={bt1.image_url} alt="" width={14} height={14} className="object-contain" />
                              </div>
                            )}
                            <span className="text-xs text-text-0 font-medium">{bt1?.name || "TBD"}</span>
                          </div>
                          <span className={cn("text-sm font-bold tabular-nums", bs1 > bs2 ? "text-accent" : "text-text-2")}>{bs1}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-md bg-surface-0 px-3 py-2">
                          <div className="flex items-center gap-2">
                            {bt2?.image_url && (
                              <div className="h-5 w-5 rounded bg-logo-bg ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center">
                                <Image src={bt2.image_url} alt="" width={14} height={14} className="object-contain" />
                              </div>
                            )}
                            <span className="text-xs text-text-0 font-medium">{bt2?.name || "TBD"}</span>
                          </div>
                          <span className={cn("text-sm font-bold tabular-nums", bs2 > bs1 ? "text-accent" : "text-text-2")}>{bs2}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <EmptyState title={t("bracket")} description={t("nothing_here")} />
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
