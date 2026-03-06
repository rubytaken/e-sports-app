"use client";

import { Suspense, useState } from "react";
import { useTournamentsPaginated } from "@/lib/api/tournaments";
import { TournamentCard } from "@/components/tournament/tournament-card";
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
  const [tab, setTab] = useState<"running" | "upcoming" | "past">("running");
  const [tier, setTier] = useState("");
  const [page, setPage] = useState(1);
  const { activeGame } = useGameFilter();

  const params: QueryParams = {
    ...(tier ? { "filter[tier]": tier } : {}),
  };

  const q = useTournamentsPaginated(tab, page, PAGE_SIZE, activeGame || undefined, params);
  const totalPages = q.data ? Math.ceil(q.data.total / PAGE_SIZE) : 0;

  const tabs = [
    { key: "running" as const, label: t("tournaments.tab.active") },
    { key: "upcoming" as const, label: t("tournaments.tab.upcoming") },
    { key: "past" as const, label: t("tournaments.tab.past") },
  ];

  const tiers = [
    { key: "", label: t("tournaments.tiers.all") },
    { key: "s", label: "S" },
    { key: "a", label: "A" },
    { key: "b", label: "B" },
  ];

  const handleTabChange = (key: "running" | "upcoming" | "past") => {
    setTab(key);
    setPage(1);
  };

  const handleTierChange = (key: string) => {
    setTier(key);
    setPage(1);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <h1 className="text-lg font-semibold text-text-0 mb-1">{t("tournaments.title")}</h1>
        <p className="text-xs text-text-2 mb-6">{t("tournaments.subtitle")}</p>

        <div className="mb-6"><GameFilter /></div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-1 border-b border-border pb-px">
            {tabs.map((tb) => (
              <button key={tb.key} onClick={() => handleTabChange(tb.key)}
                className={cn(
                  "rounded-t-md px-4 py-2 text-xs font-medium transition-colors",
                  tab === tb.key
                    ? "bg-surface-2 text-text-0 border-b-2 border-accent"
                    : "text-text-2 hover:text-text-1"
                )}>
                {tb.label}
              </button>
            ))}
          </div>
          <div className="h-5 w-px bg-border hidden sm:block" />
          <div className="flex gap-1">
            {tiers.map((ti) => (
              <button key={ti.key} onClick={() => handleTierChange(ti.key)}
                className={cn("rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  tier === ti.key ? "bg-accent/10 text-accent" : "text-text-2 hover:text-text-1")}>
                {ti.label}
              </button>
            ))}
          </div>
        </div>

        {q.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} className="h-40" />)}
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
        )}
      </div>
    </PageTransition>
  );
}

export default function TournamentsPage() {
  return <Suspense><Content /></Suspense>;
}
