"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePlayersPaginated } from "@/lib/api/players";
import { GameFilter } from "@/components/shared/game-filter";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/shared/animated-container";
import { useGameFilter } from "@/hooks/use-game-filter";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocale } from "@/hooks/use-locale";
import type { QueryParams } from "@/lib/api/types";

const PAGE_SIZE = 30;

function Content() {
  const { t } = useLocale();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounce(search, 400);
  const { activeGame } = useGameFilter();

  const params: QueryParams = {
    ...(q ? { "search[name]": q } : {}),
  };

  const { data, isLoading, isError, refetch } = usePlayersPaginated(page, PAGE_SIZE, activeGame || undefined, params);
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-lg font-semibold text-text-0">{t("players.title")}</h1>
          {data && data.total > 0 && (
            <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-2 tabular-nums">{data.total}</span>
          )}
        </div>
        <p className="text-xs text-text-2 mb-6">{t("players.subtitle")}</p>

        <div className="mb-4"><GameFilter /></div>
        <div className="mb-6"><SearchInput value={search} onChange={handleSearch} placeholder={t("search_players")} className="max-w-xs" /></div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 15 }).map((_, i) => <CardSkeleton key={i} className="h-32" />)}
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data?.data.length ? (
          <>
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {data.data.map((p) => (
                <StaggerItem key={p.id}>
                  <Link href={`/players/${p.slug}`}>
                    <div className="rounded-xl border border-border bg-surface-1 p-4 text-center card-hover hover:border-border-hover">
                      <div className="h-10 w-10 mx-auto rounded-full bg-logo-bg shadow-sm ring-1 ring-black/5 dark:ring-white/5 overflow-hidden flex items-center justify-center mb-2">
                        {p.image_url ? <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-cover" /> :
                          <span className="text-xs font-bold text-text-2">{p.name[0]}</span>}
                      </div>
                      <p className="text-xs font-medium text-text-0 truncate">{p.name}</p>
                      {p.first_name && <p className="text-[10px] text-text-2 truncate">{p.first_name} {p.last_name}</p>}
                      {p.role && (
                        <span className="inline-block mt-1 text-[10px] text-accent bg-accent/10 rounded-md px-1.5 py-0.5 capitalize font-medium">{p.role}</span>
                      )}
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={data.total}
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

export default function PlayersPage() {
  return <Suspense><Content /></Suspense>;
}
