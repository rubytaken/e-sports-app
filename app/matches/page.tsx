"use client";

import { Suspense, useState } from "react";
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

const PAGE_SIZE = 20;

function Content() {
  const { t } = useLocale();
  const [tab, setTab] = useState<"running" | "upcoming" | "past">("running");
  const [page, setPage] = useState(1);
  const { activeGame } = useGameFilter();

  const q = useMatchesPaginated(tab, page, PAGE_SIZE, activeGame || undefined);
  const totalPages = q.data ? Math.ceil(q.data.total / PAGE_SIZE) : 0;

  const tabs = [
    { key: "running" as const, label: t("matches.tab.live") },
    { key: "upcoming" as const, label: t("matches.tab.upcoming") },
    { key: "past" as const, label: t("matches.tab.results") },
  ];

  const handleTabChange = (key: "running" | "upcoming" | "past") => {
    setTab(key);
    setPage(1);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-lg font-semibold text-text-0">{t("matches.title")}</h1>
          {q.data && q.data.total > 0 && tab === "running" && (
            <span className="flex items-center gap-1.5 rounded-md bg-live/10 px-2 py-0.5 text-[10px] font-semibold text-live">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" />{q.data.total}
            </span>
          )}
        </div>
        <p className="text-xs text-text-2 mb-6">{t("matches.subtitle")}</p>

        <div className="mb-6"><GameFilter /></div>

        <div className="flex gap-1 mb-6 border-b border-border pb-px">
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
