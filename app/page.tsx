"use client";

import { Suspense } from "react";
import Link from "next/link";
import { SafeImage } from "@/components/shared/safe-image";
import { GameIcon } from "@/components/shared/game-icon";
import { ArrowRight, Crosshair, TrendingUp } from "lucide-react";
import { useMatchesRunning, useMatchesUpcoming, useMatchesPast } from "@/lib/api/matches";
import { useTournamentsRunning } from "@/lib/api/tournaments";
import { MatchCard } from "@/components/match/match-card";
import { TournamentCard } from "@/components/tournament/tournament-card";
import { MatchSkeleton, CardSkeleton } from "@/components/shared/loading-skeleton";
import { GameFilter } from "@/components/shared/game-filter";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/shared/animated-container";
import { useGameFilter } from "@/hooks/use-game-filter";
import { useLocale } from "@/hooks/use-locale";
import type { Match, Team } from "@/lib/api/types";

function FeaturedMatch({ match }: { match: Match }) {
  const t1 = match.opponents?.[0]?.opponent as Team | undefined;
  const t2 = match.opponents?.[1]?.opponent as Team | undefined;
  const s1 = match.results?.[0]?.score ?? 0;
  const s2 = match.results?.[1]?.score ?? 0;
  const isLive = match.status === "running";

  return (
    <Link href={`/matches/${match.id}`} className="block h-full">
      <div className={`relative flex h-full flex-col rounded-lg border p-5 transition-all card-hover featured-gradient ${isLive ? "live-card" : "border-border hover:border-border-hover"}`}>
        {isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-live/10 border border-live/20 px-2.5 py-1">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" />
            <span className="text-[10px] font-bold text-live uppercase tracking-wider">Live</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] text-accent font-semibold uppercase tracking-wider flex items-center gap-1">
            {match.videogame?.slug && <GameIcon slug={match.videogame.slug} size={11} className="text-accent" />}
            {match.videogame?.name}
          </span>
          <span className="text-[10px] text-text-2">BO{match.number_of_games}</span>
        </div>

        <div className="flex items-center justify-between">
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-14 w-14 rounded-lg img-container overflow-hidden flex items-center justify-center">
              {t1?.image_url ? (
                <SafeImage src={t1.image_url} alt={t1.name} width={40} height={40} className="object-contain" fallbackText={t1?.acronym?.[0] || "?"} fallbackClassName="text-lg font-bold text-text-2" />
              ) : (
                <span className="text-lg font-bold text-text-2">{t1?.acronym?.[0] || "?"}</span>
              )}
            </div>
            <span className="text-xs font-semibold text-text-0 text-center truncate max-w-[80px]">{t1?.name || "TBD"}</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 px-4">
            <span className="text-3xl font-extrabold text-text-0 tabular-nums">{s1}</span>
            <span className="text-text-2/40 text-lg">-</span>
            <span className="text-3xl font-extrabold text-text-0 tabular-nums">{s2}</span>
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="h-14 w-14 rounded-lg img-container overflow-hidden flex items-center justify-center">
              {t2?.image_url ? (
                <SafeImage src={t2.image_url} alt={t2.name} width={40} height={40} className="object-contain" fallbackText={t2?.acronym?.[0] || "?"} fallbackClassName="text-lg font-bold text-text-2" />
              ) : (
                <span className="text-lg font-bold text-text-2">{t2?.acronym?.[0] || "?"}</span>
              )}
            </div>
            <span className="text-xs font-semibold text-text-0 text-center truncate max-w-[80px]">{t2?.name || "TBD"}</span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-border/30 flex items-center gap-2">
          {match.league?.image_url && (
            <div className="h-4 w-4 rounded img-container overflow-hidden flex items-center justify-center shrink-0">
              <SafeImage src={match.league.image_url} alt="" width={12} height={12} className="object-contain" fallbackText="" />
            </div>
          )}
          <span className="text-[10px] text-text-2 truncate">{match.league?.name}</span>
        </div>
      </div>
    </Link>
  );
}

function Section({ title, href, count, viewAll, children }: {
  title: string; href: string; count?: number; viewAll: string; children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-[15px] font-bold text-text-0">{title}</h2>
          {!!count && count > 0 && (
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-2 tabular-nums font-medium">{count}</span>
          )}
        </div>
        <Link href={href} className="flex items-center gap-1.5 text-xs text-text-2 hover:text-accent transition-colors font-medium">
          {viewAll} <ArrowRight size={12} />
        </Link>
      </div>
      {children}
    </section>
  );
}

function Skeletons({ n = 4, type = "match" }: { n?: number; type?: "match" | "card" }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: n }).map((_, i) =>
        type === "match" ? <MatchSkeleton key={i} /> : <CardSkeleton key={i} className="h-40" />
      )}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-1 py-12 text-center">
      <p className="text-xs text-text-2">{text}</p>
    </div>
  );
}

function Dashboard() {
  const { t } = useLocale();
  const { activeGame } = useGameFilter();
  const gameSlug = activeGame || undefined;

  const live = useMatchesRunning(gameSlug);
  const upcoming = useMatchesUpcoming(gameSlug);
  const past = useMatchesPast(gameSlug);
  const tournamentsRunning = useTournamentsRunning(gameSlug);

  const liveTotal = live.data?.total ?? 0;
  const upcomingTotal = upcoming.data?.total ?? 0;
  const tournamentsTotal = tournamentsRunning.data?.total ?? 0;

  const liveMatches = live.data?.data ?? [];
  const upcomingMatches = upcoming.data?.data ?? [];
  const pastMatches = past.data?.data ?? [];
  const ongoingTournaments = tournamentsRunning.data?.data ?? [];

  return (
    <PageTransition>
      {/* Hero Section */}
      <div className="hero-gradient border-b border-border">
        <div className="mx-auto max-w-[1200px] px-5 py-12 sm:py-16 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/8 border border-accent/15 px-3 py-1 mb-4">
              <Crosshair size={12} className="text-accent" />
              <span className="text-[11px] text-accent font-semibold uppercase tracking-wider">Live Esports Tracker</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-0 leading-[1.1]">
              {t("home.title")}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-text-1 max-w-lg leading-relaxed">{t("home.subtitle")}</p>

            {/* Inline stats badges instead of big stat cards */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {liveTotal > 0 && (
                <Link href="/matches" className="inline-flex items-center gap-2 rounded-full bg-live/10 border border-live/20 px-4 py-2 text-xs font-semibold text-live transition-all hover:bg-live/15 neon-border-pulse">
                  <span className="live-dot h-2 w-2 rounded-full bg-live" />
                  {liveTotal} {t("home.live_now")}
                  <ArrowRight size={12} />
                </Link>
              )}
              {tournamentsTotal > 0 && (
                <Link href="/tournaments" className="inline-flex items-center gap-2 rounded-full bg-blue/8 border border-blue/15 px-4 py-2 text-xs font-semibold text-blue transition-all hover:bg-blue/12">
                  {tournamentsTotal} {t("home.hero.stats.tournaments")}
                </Link>
              )}
              {upcomingTotal > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-border px-4 py-2 text-xs font-medium text-text-1">
                  <TrendingUp size={12} />
                  {upcomingTotal} {t("home.section.upcoming")}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 py-8">
        <div className="mb-6"><GameFilter /></div>

        {/* Featured Live Matches */}
        {liveMatches.length > 0 && (
          <Section title={t("home.section.live")} href="/matches" count={liveTotal} viewAll={t("view_all")}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-2">
              {liveMatches.slice(0, 2).map((m) => (
                <FeaturedMatch key={m.id} match={m} />
              ))}
            </div>
            {liveMatches.length > 2 && (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {liveMatches.slice(2, 8).map((m) => (
                  <StaggerItem key={m.id}><MatchCard match={m} /></StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </Section>
        )}

        {/* Show empty live section if no live matches */}
        {!live.isLoading && liveMatches.length === 0 && (
          <Section title={t("home.section.live")} href="/matches" count={0} viewAll={t("view_all")}>
            <Empty text={t("home.empty.live")} />
          </Section>
        )}

        {/* Loading state for live */}
        {live.isLoading && (
          <Section title={t("home.section.live")} href="/matches" viewAll={t("view_all")}>
            <Skeletons n={2} />
          </Section>
        )}

        {/* Ongoing Tournaments */}
        {ongoingTournaments.length > 0 && (
          <Section title={t("home.hero.stats.tournaments")} href="/tournaments" count={tournamentsTotal} viewAll={t("view_all")}>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ongoingTournaments.slice(0, 6).map((tournament) => (
                <StaggerItem key={tournament.id}><TournamentCard tournament={tournament} /></StaggerItem>
              ))}
            </StaggerContainer>
          </Section>
        )}

        {/* Upcoming Matches */}
        <Section title={t("home.section.upcoming")} href="/matches" count={upcomingTotal} viewAll={t("view_all")}>
          {upcoming.isLoading ? <Skeletons /> : upcomingMatches.length ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {upcomingMatches.slice(0, 8).map((m) => (
                <StaggerItem key={m.id}><MatchCard match={m} /></StaggerItem>
              ))}
            </StaggerContainer>
          ) : <Empty text={t("home.empty.upcoming")} />}
        </Section>

        {/* Recent Results */}
        <Section title={t("home.section.results")} href="/matches" count={past.data?.total} viewAll={t("view_all")}>
          {past.isLoading ? <Skeletons /> : pastMatches.length ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pastMatches.slice(0, 8).map((m) => (
                <StaggerItem key={m.id}><MatchCard match={m} /></StaggerItem>
              ))}
            </StaggerContainer>
          ) : <Empty text={t("home.empty.results")} />}
        </Section>
      </div>
    </PageTransition>
  );
}

export default function Home() {
  return <Suspense><Dashboard /></Suspense>;
}
