"use client";

import { Suspense, useMemo, useState } from "react";
import { useMatchesPaginated } from "@/lib/api/matches";
import { MatchCard } from "@/components/match/match-card";
import { GameFilter } from "@/components/shared/game-filter";
import { Pagination } from "@/components/shared/pagination";
import { MatchSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/shared/animated-container";
import { useGameFilter } from "@/hooks/use-game-filter";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import type { QueryParams } from "@/lib/api/types";

const PAGE_SIZE = 20;
type ResultFilter = "finished" | "canceled" | "all";

function Content() {
  const { t } = useLocale();
  const [tab, setTab] = useState<"running" | "upcoming" | "past">("running");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("finished");
  const [page, setPage] = useState(1);
  const { activeGame } = useGameFilter();

  const matchParams = useMemo<QueryParams | undefined>(() => {
    if (tab !== "past" || resultFilter === "all") return undefined;
    return { "filter[status]": resultFilter };
  }, [tab, resultFilter]);

  const q = useMatchesPaginated(tab, page, PAGE_SIZE, activeGame || undefined, matchParams);
  const totalPages = q.data ? Math.ceil(q.data.total / PAGE_SIZE) : 0;

  const tabs = [
    { key: "running" as const, label: t("matches.tab.live"), live: true },
    { key: "upcoming" as const, label: t("matches.tab.upcoming") },
    { key: "past" as const, label: t("matches.tab.results") },
  ];

  const handleTabChange = (key: "running" | "upcoming" | "past") => {
    setTab(key);
    setPage(1);
  };

  const resultFilters: Array<{ key: ResultFilter; label: string }> = [
    { key: "finished", label: t("matches.filter.finished") },
    { key: "canceled", label: t("matches.filter.canceled") },
    { key: "all", label: t("matches.filter.all") },
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-bold text-text-0">{t("matches.title")}</h1>
          {q.data && q.data.total > 0 && tab === "running" && (
            <span className="flex items-center gap-1.5 rounded-full bg-live/10 border border-live/20 px-3 py-1 text-[10px] font-bold text-live uppercase tracking-wider">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" />{q.data.total} Live
            </span>
          )}
        </div>
        <p className="text-xs text-text-2 mb-6">{t("matches.subtitle")}</p>

        <div className="mb-6"><GameFilter /></div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tabs.map((tb) => (
            <button key={tb.key} onClick={() => handleTabChange(tb.key)}
              className={cn(
                "tab-pill",
                tab === tb.key && "tab-pill-active"
              )}>
              <span className="flex items-center gap-1.5">
                {tb.live && tab === tb.key && (
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-white/80" />
                )}
                {tb.label}
              </span>
            </button>
          ))}
        </div>

        {tab === "past" && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {resultFilters.map((filter) => {
              const active = resultFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => {
                    setResultFilter(filter.key);
                    setPage(1);
                  }}
                  className={cn(
                    "tab-pill",
                    active && "tab-pill-active"
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        )}

        {q.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{Array.from({ length: 6 }).map((_, i) => <MatchSkeleton key={i} />)}</div>
        ) : q.isError ? (
          <ErrorState onRetry={() => q.refetch()} />
        ) : q.data?.data.length ? (
          <>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.data.data.map((m) => (
                <StaggerItem key={m.id}><MatchCard match={m} /></StaggerItem>
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

export default function MatchesPage() {
  return <Suspense><Content /></Suspense>;
}
