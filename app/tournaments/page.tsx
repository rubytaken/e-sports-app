"use client";

import { Suspense, useState } from "react";
import { useTournamentsPaginated } from "@/lib/api/tournaments";
import { useCustomTournaments } from "@/lib/api/custom-tournaments";
import { TournamentCard } from "@/components/tournament/tournament-card";
import { CustomTournamentCard } from "@/components/tournament/custom-tournament-card";
import { CreateTournamentModal } from "@/components/tournament/create-tournament-modal";
import { GameFilter } from "@/components/shared/game-filter";
import { Pagination } from "@/components/shared/pagination";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/shared/animated-container";
import { useGameFilter } from "@/hooks/use-game-filter";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import type { QueryParams } from "@/lib/api/types";

const PAGE_SIZE = 18;

function Content() {
  const { t } = useLocale();
  const [tab, setTab] = useState<"running" | "upcoming" | "past" | "community">("running");
  const [tier, setTier] = useState("");
  const [page, setPage] = useState(1);
  const { activeGame } = useGameFilter();

  const params: QueryParams = {
    ...(tier ? { "filter[tier]": tier } : {}),
  };

  // PandaScore tournaments (only when not on community tab)
  const q = useTournamentsPaginated(
    tab === "community" ? "running" : tab,
    page,
    PAGE_SIZE,
    activeGame || undefined,
    params,
  );
  const totalPages = q.data ? Math.ceil(q.data.total / PAGE_SIZE) : 0;

  // Custom tournaments from Supabase
  const customQ = useCustomTournaments();

  const tabs = [
    { key: "running" as const, label: t("tournaments.tab.active") },
    { key: "upcoming" as const, label: t("tournaments.tab.upcoming") },
    { key: "past" as const, label: t("tournaments.tab.past") },
    { key: "community" as const, label: t("tournaments.tab.community") || "Community" },
  ];

  const tiers = [
    { key: "", label: t("tournaments.tiers.all") },
    { key: "s", label: "S", style: "text-tier-s" },
    { key: "a", label: "A", style: "text-tier-a" },
    { key: "b", label: "B", style: "text-tier-b" },
  ];

  const handleTabChange = (key: "running" | "upcoming" | "past" | "community") => {
    setTab(key);
    setPage(1);
  };

  const handleTierChange = (key: string) => {
    setTier(key);
    setPage(1);
  };

  const isCommunity = tab === "community";

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        {/* Header with Create button */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-text-0 mb-1">{t("tournaments.title")}</h1>
            <p className="text-xs text-text-2">{t("tournaments.subtitle")}</p>
          </div>
          <CreateTournamentModal />
        </div>

        <div className="mb-6"><GameFilter /></div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-border">
            {tabs.map((tb) => (
              <button key={tb.key} onClick={() => handleTabChange(tb.key)}
                className={cn(
                  "relative px-4 py-2.5 text-xs font-semibold transition-all",
                  tab === tb.key ? "text-accent" : "text-text-2 hover:text-text-1"
                )}>
                {tb.label}
                {tb.key === "community" && customQ.data?.length ? (
                  <span className="ml-1.5 rounded-full bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold text-accent tabular-nums">
                    {customQ.data.length}
                  </span>
                ) : null}
                {tab === tb.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent" />
                )}
              </button>
            ))}
          </div>

          {/* Tier filter (hide on community tab) */}
          {!isCommunity && (
            <>
              <div className="h-5 w-px bg-border hidden sm:block" />
              <div className="flex gap-1">
                {tiers.map((ti) => (
                  <button key={ti.key} onClick={() => handleTierChange(ti.key)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-[11px] font-bold transition-all",
                      tier === ti.key
                        ? "bg-accent/8 text-accent border-accent/20"
                        : "border-border text-text-2 hover:text-text-1 hover:border-border-hover",
                      ti.style && tier !== ti.key ? ti.style : ""
                    )}>
                    {ti.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        {isCommunity ? (
          /* Community tournaments from Supabase */
          customQ.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} className="h-44" />)}
            </div>
          ) : customQ.isError ? (
            <ErrorState onRetry={() => customQ.refetch()} />
          ) : customQ.data?.length ? (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {customQ.data.map((ct) => (
                <StaggerItem key={ct.id}>
                  <CustomTournamentCard tournament={ct} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <EmptyState
              title={t("tournaments.community_empty_title") || "No community tournaments yet"}
              description={t("tournaments.community_empty_desc") || "Be the first to create one!"}
            />
          )
        ) : (
          /* PandaScore tournaments */
          q.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} className="h-44" />)}
            </div>
          ) : q.isError ? (
            <ErrorState onRetry={() => q.refetch()} />
          ) : q.data?.data.length ? (
            <>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {q.data.data.map((t) => (
                  <StaggerItem key={t.id}><TournamentCard tournament={t} /></StaggerItem>
                ))}
              </StaggerContainer>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={q.data.total}
                onPageChange={setPage}
              />
            </>
          ) : (
            <EmptyState title={t("nothing_here")} description={t("try_filters")} />
          )
        )}
      </div>
    </PageTransition>
  );
}

export default function TournamentsPage() {
  return <Suspense><Content /></Suspense>;
}
