"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User, Trophy, Swords, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { usePlayer, usePlayerMatches, usePlayerTournaments } from "@/lib/api/players";
import { MatchCard } from "@/components/match/match-card";
import { TierBadge } from "@/components/shared/tier-badge";
import { ProfileSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard, WinRateCard, RecentFormCard } from "@/components/shared/stat-card";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/shared/animated-container";
import { useLocale } from "@/hooks/use-locale";
import { cn, formatDate } from "@/lib/utils";
import type { Match, Team } from "@/lib/api/types";

function computePlayerStats(matches: Match[] | undefined, teamId: number | undefined) {
  if (!matches?.length) return { wins: 0, losses: 0, recentForm: [] as ("W" | "L")[] };
  let wins = 0;
  let losses = 0;
  const recentForm: ("W" | "L")[] = [];

  for (const m of matches) {
    if (m.status !== "finished" || !teamId) continue;
    // Check if the player's team won
    const playerOpponent = m.opponents?.find(
      (o) => (o.opponent as Team)?.id === teamId
    );
    const won = playerOpponent ? m.winner_id === teamId : false;
    if (won) wins++;
    else losses++;
    if (recentForm.length < 10) recentForm.push(won ? "W" : "L");
  }

  return { wins, losses, recentForm };
}

export default function PlayerProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useLocale();
  const [tab, setTab] = useState<string>("overview");

  const { data: p, isLoading, isError, refetch } = usePlayer(slug);
  const matches = usePlayerMatches(slug);
  const tournaments = usePlayerTournaments(slug);

  const stats = useMemo(
    () => computePlayerStats(matches.data, p?.current_team?.id),
    [matches.data, p?.current_team?.id]
  );

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !p) return <ErrorState message="Failed to load player." onRetry={() => refetch()} />;

  const tabItems = [
    { key: "overview", label: t("player.overview") },
    { key: "matches", label: t("player.matches") },
    { key: "tournaments", label: t("player.tournaments") },
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        {/* Back */}
        <Link href="/players" className="inline-flex items-center gap-1.5 text-xs text-text-2 hover:text-text-0 transition-colors mb-8">
          <ArrowLeft size={13} /> {t("back")}
        </Link>

        {/* Hero */}
        <div className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="h-20 w-20 shrink-0 rounded-full bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center">
              {p.image_url ? (
                <Image src={p.image_url} alt={p.name} width={80} height={80} className="object-cover" />
              ) : (
                <span className="text-2xl font-bold text-text-2">{p.name[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-text-0">{p.name}</h1>
              {p.first_name && (
                <p className="text-sm text-text-2 mt-0.5">{p.first_name} {p.last_name}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs text-text-2 mt-2">
                {p.role && (
                  <span className="inline-flex items-center gap-1 bg-accent/10 text-accent rounded-md px-2 py-0.5 font-medium capitalize">
                    <User size={11} />
                    {p.role}
                  </span>
                )}
                {p.nationality && (
                  <span className="uppercase">{p.nationality}</span>
                )}
                {p.age && (
                  <span>{p.age} years old</span>
                )}
              </div>
              {p.current_team && (
                <Link
                  href={`/teams/${p.current_team.slug}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-surface-0 px-3 py-1.5 text-xs text-text-0 hover:bg-surface-2/60 transition-colors"
                >
                  {p.current_team.image_url && (
                    <Image src={p.current_team.image_url} alt="" width={18} height={18} className="object-contain" />
                  )}
                  {p.current_team.name}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StaggerItem>
            <StatCard
              label={t("player.stats.matches")}
              value={stats.wins + stats.losses}
              icon={<Swords size={14} />}
            />
          </StaggerItem>
          <StaggerItem>
            <WinRateCard label={t("player.stats.winrate")} wins={stats.wins} losses={stats.losses} />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label={t("player.stats.tournaments")}
              value={tournaments.data?.length ?? 0}
              icon={<Trophy size={14} />}
              accent
            />
          </StaggerItem>
          <StaggerItem>
            <RecentFormCard label={t("team.stats.recent")} results={stats.recentForm} />
          </StaggerItem>
        </StaggerContainer>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border pb-px overflow-x-auto">
          {tabItems.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={cn(
                "rounded-t-md px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap",
                tab === tb.key
                  ? "bg-surface-2 text-text-0 border-b-2 border-accent"
                  : "text-text-2 hover:text-text-1"
              )}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Overview */}
          {tab === "overview" && (
            <div className="space-y-8">
              {/* Player Info Card */}
              <section>
                <h2 className="text-sm font-semibold text-text-0 mb-3">{t("player.career")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {p.current_team && (
                    <div className="rounded-xl border border-border bg-surface-1 p-4">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-text-2">{t("player.stats.team")}</span>
                      <Link href={`/teams/${p.current_team.slug}`} className="flex items-center gap-2 mt-2 hover:text-accent transition-colors">
                        {p.current_team.image_url && (
                          <Image src={p.current_team.image_url} alt="" width={24} height={24} className="object-contain" />
                        )}
                        <span className="text-sm font-medium text-text-0">{p.current_team.name}</span>
                      </Link>
                    </div>
                  )}
                  {p.current_videogame && (
                    <div className="rounded-xl border border-border bg-surface-1 p-4">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-text-2">{t("games")}</span>
                      <p className="text-sm font-medium text-text-0 mt-2">{p.current_videogame.name}</p>
                    </div>
                  )}
                  {p.birthday && (
                    <div className="rounded-xl border border-border bg-surface-1 p-4">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-text-2">Birthday</span>
                      <p className="text-sm font-medium text-text-0 mt-2 flex items-center gap-1.5">
                        <Calendar size={13} className="text-text-2" />
                        {formatDate(p.birthday)}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Recent Matches Timeline */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-text-0">{t("recent_matches")}</h2>
                  <button onClick={() => setTab("matches")} className="text-[11px] text-text-2 hover:text-accent transition-colors">
                    {t("view_all")}
                  </button>
                </div>
                {matches.isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-12 rounded-lg bg-surface-2 animate-pulse" />
                    ))}
                  </div>
                ) : matches.data?.length ? (
                  <div className="space-y-1.5">
                    {matches.data.slice(0, 5).map((m) => {
                      const won = m.status === "finished" && m.winner_id === p.current_team?.id;
                      const t1 = m.opponents?.[0]?.opponent as Team | undefined;
                      const t2 = m.opponents?.[1]?.opponent as Team | undefined;
                      const s1 = m.results?.[0]?.score ?? 0;
                      const s2 = m.results?.[1]?.score ?? 0;

                      return (
                        <Link key={m.id} href={`/matches/${m.id}`}>
                          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 px-4 py-2.5 hover:bg-surface-2/60 transition-colors">
                            {m.status === "finished" && (
                              <span className={cn(
                                "text-[10px] font-bold w-5 text-center",
                                won ? "text-accent" : "text-live"
                              )}>
                                {won ? "W" : "L"}
                              </span>
                            )}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xs text-text-0 truncate">{t1?.name || "TBD"}</span>
                              <span className="font-display text-sm font-bold text-text-0 tabular-nums shrink-0">
                                {s1}<span className="text-text-2 mx-0.5">:</span>{s2}
                              </span>
                              <span className="text-xs text-text-0 truncate">{t2?.name || "TBD"}</span>
                            </div>
                            <span className="text-[10px] text-text-2 shrink-0">{formatDate(m.scheduled_at)}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : <EmptyState title={t("player.no_matches")} />}
              </section>
            </div>
          )}

          {/* Matches */}
          {tab === "matches" && (
            matches.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-lg bg-surface-2 animate-pulse" />
                ))}
              </div>
            ) : matches.data?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matches.data.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            ) : <EmptyState title={t("player.no_matches")} />
          )}

          {/* Tournaments */}
          {tab === "tournaments" && (
            tournaments.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-lg bg-surface-2 animate-pulse" />
                ))}
              </div>
            ) : tournaments.data?.length ? (
              <div className="space-y-1.5">
                {tournaments.data.map((tr) => (
                  <Link key={tr.id} href={`/tournaments/${tr.id}`}>
                    <div className="flex items-center justify-between rounded-lg border border-border bg-surface-1 px-4 py-3 hover:bg-surface-2/60 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        {tr.league?.image_url && (
                          <div className="h-6 w-6 rounded bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center shrink-0">
                            <Image src={tr.league.image_url} alt="" width={16} height={16} className="object-contain" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-text-0 truncate block">{tr.name}</span>
                          {tr.serie?.full_name && (
                            <span className="text-[10px] text-text-2 truncate block">{tr.serie.full_name}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <TierBadge tier={tr.tier} />
                        <span className="text-[10px] text-text-2">{formatDate(tr.begin_at)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : <EmptyState title={t("player.no_tournaments")} />
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
