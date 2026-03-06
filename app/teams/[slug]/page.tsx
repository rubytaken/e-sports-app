"use client";

import { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Gamepad2, Trophy, Swords, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useTeam, useTeamMatches, useTeamTournaments } from "@/lib/api/teams";
import { MatchCard } from "@/components/match/match-card";
import { TierBadge } from "@/components/shared/tier-badge";
import { ProfileSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard, WinRateCard, RecentFormCard } from "@/components/shared/stat-card";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/shared/animated-container";
import { useLocale } from "@/hooks/use-locale";
import { cn, formatDate } from "@/lib/utils";
import type { Team, Match } from "@/lib/api/types";

const tabs = ["overview", "roster", "matches", "tournaments"] as const;

function computeStats(matches: Match[] | undefined, teamId: number) {
  if (!matches?.length) return { wins: 0, losses: 0, recentForm: [] as ("W" | "L")[] };
  let wins = 0;
  let losses = 0;
  const recentForm: ("W" | "L")[] = [];

  for (const m of matches) {
    if (m.status !== "finished") continue;
    const won = m.winner_id === teamId;
    if (won) wins++;
    else losses++;
    if (recentForm.length < 10) recentForm.push(won ? "W" : "L");
  }

  return { wins, losses, recentForm };
}

export default function TeamProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { t } = useLocale();
  const [tab, setTab] = useState<string>("overview");

  const { data: team, isLoading, isError, refetch } = useTeam(slug);
  const matches = useTeamMatches(slug);
  const tournaments = useTeamTournaments(slug);

  const stats = useMemo(
    () => computeStats(matches.data, team?.id ?? 0),
    [matches.data, team?.id]
  );

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !team) return <ErrorState message="Failed to load team." onRetry={() => refetch()} />;

  const tabItems = [
    { key: "overview", label: t("team.overview") },
    { key: "roster", label: t("team.roster") },
    { key: "matches", label: t("team.matches") },
    { key: "tournaments", label: t("team.tournaments") },
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        {/* Back */}
        <Link href="/teams" className="inline-flex items-center gap-1.5 text-xs text-text-2 hover:text-text-0 transition-colors mb-8">
          <ArrowLeft size={13} /> {t("back")}
        </Link>

        {/* Hero */}
        <div className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="h-20 w-20 shrink-0 rounded-2xl bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center">
              {team.image_url ? (
                <Image src={team.image_url} alt={team.name} width={56} height={56} className="object-contain" />
              ) : (
                <span className="text-2xl font-bold text-text-2">{team.acronym?.[0] || "?"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-text-0">{team.name}</h1>
                {team.acronym && (
                  <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-text-2">{team.acronym}</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-text-2 mt-2">
                {team.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    <span className="uppercase">{team.location}</span>
                  </span>
                )}
                {team.current_videogame && (
                  <span className="inline-flex items-center gap-1">
                    <Gamepad2 size={12} />
                    {team.current_videogame.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StaggerItem>
            <StatCard
              label={t("team.stats.matches")}
              value={stats.wins + stats.losses}
              icon={<Swords size={14} />}
            />
          </StaggerItem>
          <StaggerItem>
            <WinRateCard label={t("team.stats.winrate")} wins={stats.wins} losses={stats.losses} />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label={t("team.stats.tournaments")}
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
              {/* Roster Preview */}
              {team.players && team.players.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-text-0">{t("team.roster")}</h2>
                    <button onClick={() => setTab("roster")} className="text-[11px] text-text-2 hover:text-accent transition-colors">
                      {t("view_all")}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {team.players.slice(0, 5).map((p) => (
                      <Link key={p.id} href={`/players/${p.slug}`}>
                        <div className="rounded-xl border border-border bg-surface-1 p-3 text-center card-hover">
                          <div className="h-10 w-10 mx-auto rounded-full bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center mb-2">
                            {p.image_url ? <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-cover" /> :
                              <span className="text-[10px] font-bold text-text-2">{p.name[0]}</span>}
                          </div>
                          <p className="text-xs font-medium text-text-0 truncate">{p.name}</p>
                          {p.role && (
                            <span className="inline-block mt-1 text-[10px] text-text-2 bg-surface-2 rounded-md px-1.5 py-0.5 capitalize">{p.role}</span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Matches */}
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
                      const won = m.status === "finished" && m.winner_id === team.id;
                      const t1 = m.opponents?.[0]?.opponent as Team | undefined;
                      const t2 = m.opponents?.[1]?.opponent as Team | undefined;
                      const opponent = t1?.id === team.id ? t2 : t1;
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
                            <div className="h-6 w-6 rounded bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center shrink-0">
                              {opponent?.image_url ? (
                                <Image src={opponent.image_url} alt="" width={18} height={18} className="object-contain" />
                              ) : (
                                <span className="text-[8px] font-bold text-text-2">{opponent?.acronym?.[0] || "?"}</span>
                              )}
                            </div>
                            <span className="text-xs text-text-0 flex-1 truncate">{opponent?.name || "TBD"}</span>
                            <span className="font-display text-sm font-bold text-text-0 tabular-nums">
                              {s1}<span className="text-text-2 mx-0.5">:</span>{s2}
                            </span>
                            <span className="text-[10px] text-text-2 shrink-0">{formatDate(m.scheduled_at)}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : <EmptyState title={t("team.no_matches")} />}
              </section>
            </div>
          )}

          {/* Roster */}
          {tab === "roster" && (
            team.players && team.players.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {team.players.map((p) => (
                  <Link key={p.id} href={`/players/${p.slug}`}>
                    <div className="rounded-xl border border-border bg-surface-1 p-4 card-hover">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center shrink-0">
                          {p.image_url ? <Image src={p.image_url} alt={p.name} width={48} height={48} className="object-cover" /> :
                            <span className="text-sm font-bold text-text-2">{p.name[0]}</span>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-0 truncate">{p.name}</p>
                          {p.first_name && (
                            <p className="text-[11px] text-text-2 truncate">{p.first_name} {p.last_name}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {p.role && (
                              <span className="text-[10px] bg-accent/10 text-accent rounded-md px-1.5 py-0.5 capitalize font-medium">{p.role}</span>
                            )}
                            {p.nationality && (
                              <span className="text-[10px] text-text-2 uppercase">{p.nationality}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : <EmptyState title={t("team.no_roster")} />
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
            ) : <EmptyState title={t("team.no_matches")} />
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
            ) : <EmptyState title={t("team.no_tournaments")} />
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
