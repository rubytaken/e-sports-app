"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Zap, Trophy, Users } from "lucide-react";
import { useMatchesRunning, useMatchesUpcoming, useMatchesPast } from "@/lib/api/matches";
import { useTournamentsRunning } from "@/lib/api/tournaments";
import { MatchCard } from "@/components/match/match-card";
import { MatchSkeleton } from "@/components/shared/loading-skeleton";
import { GameFilter } from "@/components/shared/game-filter";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/shared/animated-container";
import { useGameFilter } from "@/hooks/use-game-filter";
import { useLocale } from "@/hooks/use-locale";

function HeroStat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-1/80 backdrop-blur-sm px-4 py-3">
      <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-text-0 leading-tight tabular-nums">{value}</p>
        <p className="text-[10px] text-text-2 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function Section({ title, href, count, viewAll, children }: {
  title: string; href: string; count?: number; viewAll: string; children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-text-0">{title}</h2>
          {!!count && count > 0 && (
            <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-2 tabular-nums">{count}</span>
          )}
        </div>
        <Link href={href} className="flex items-center gap-1 text-[11px] text-text-2 hover:text-accent transition-colors">
          {viewAll} <ArrowRight size={11} />
        </Link>
      </div>
      {children}
    </section>
  );
}

function Skeletons({ n = 4 }: { n?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {Array.from({ length: n }).map((_, i) => <MatchSkeleton key={i} />)}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-1 py-10 text-center">
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

  // Use real totals from paginated responses
  const liveTotal = live.data?.total ?? 0;
  const upcomingTotal = upcoming.data?.total ?? 0;
  const tournamentsTotal = tournamentsRunning.data?.total ?? 0;

  // Data arrays for display
  const liveMatches = live.data?.data ?? [];
  const upcomingMatches = upcoming.data?.data ?? [];
  const pastMatches = past.data?.data ?? [];

  return (
    <PageTransition>
      {/* Hero Section */}
      <div className="hero-gradient border-b border-border">
        <div className="mx-auto max-w-[1100px] px-5 py-12 sm:py-16 relative">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-0">
              {t("home.title")}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-text-2 max-w-md leading-relaxed">{t("home.subtitle")}</p>
            {liveTotal > 0 && (
              <Link href="/matches" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-live/10 border border-live/20 px-4 py-2 text-xs font-medium text-live transition-colors hover:bg-live/15">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" />
                {liveTotal} {t("home.live_now")}
              </Link>
            )}
          </div>

          {/* Stats - showing real totals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
            <HeroStat
              icon={<Zap size={16} className="text-accent" />}
              value={liveTotal}
              label={t("home.hero.stats.live")}
            />
            <HeroStat
              icon={<Trophy size={16} className="text-accent" />}
              value={tournamentsTotal}
              label={t("home.hero.stats.tournaments")}
            />
            <HeroStat
              icon={<Users size={16} className="text-accent" />}
              value={upcomingTotal}
              label={t("home.section.upcoming")}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="mb-8"><GameFilter /></div>

        <Section title={t("home.section.live")} href="/matches" count={liveTotal} viewAll={t("view_all")}>
          {live.isLoading ? <Skeletons n={2} /> : liveMatches.length ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {liveMatches.slice(0, 8).map((m) => (
                <StaggerItem key={m.id}><MatchCard match={m} /></StaggerItem>
              ))}
            </StaggerContainer>
          ) : <Empty text={t("home.empty.live")} />}
        </Section>

        <Section title={t("home.section.upcoming")} href="/matches" count={upcomingTotal} viewAll={t("view_all")}>
          {upcoming.isLoading ? <Skeletons /> : upcomingMatches.length ? (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {upcomingMatches.slice(0, 8).map((m) => (
                <StaggerItem key={m.id}><MatchCard match={m} /></StaggerItem>
              ))}
            </StaggerContainer>
          ) : <Empty text={t("home.empty.upcoming")} />}
        </Section>

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
