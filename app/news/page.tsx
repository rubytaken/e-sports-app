"use client";

import { Suspense, useState, useEffect } from "react";
import { Newspaper } from "lucide-react";
import { useEsportsNews } from "@/lib/api/news";
import { NewsCard, NewsCardSkeleton } from "@/components/news/news-card";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/shared/animated-container";
import { useLocale } from "@/hooks/use-locale";
import { useDebounce } from "@/hooks/use-debounce";

const PAGE_SIZE = 12;

function NewsContent() {
  const { t, locale } = useLocale();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const query = useEsportsNews(page, debouncedSearch || undefined, locale);
  const articles = query.data?.articles ?? [];
  const totalResults = query.data?.totalResults ?? 0;
  const totalPages = Math.min(Math.ceil(totalResults / PAGE_SIZE), 8); // NewsAPI free caps at ~100 results

  // Filter out articles with "[Removed]" title
  const filteredArticles = articles.filter(
    (a) => a.title !== "[Removed]" && a.description !== "[Removed]"
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        {/* Header */}
        <div className="mb-1">
          <h1 className="text-lg font-semibold text-text-0">{t("news.title")}</h1>
        </div>
        <p className="text-xs text-text-2 mb-6">{t("news.subtitle")}</p>

        {/* Search Bar */}
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          placeholder={t("news.search_placeholder")}
          className="mb-6"
        />

        {/* Content */}
        {query.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : query.isError ? (
          <ErrorState
            message={t("news.error")}
            onRetry={() => query.refetch()}
          />
        ) : filteredArticles.length > 0 ? (
          <>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredArticles.map((article, idx) => (
                <StaggerItem key={`${article.url}-${idx}`}>
                  <NewsCard article={article} locale={locale} />
                </StaggerItem>
              ))}
            </StaggerContainer>

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalResults}
                onPageChange={setPage}
              />
            )}

            {/* Attribution */}
            <div className="mt-6 text-center">
              <span className="text-[10px] text-text-2">
                {t("news.powered_by")}{" "}
                <a
                  href="https://newsapi.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  NewsAPI.org
                </a>
              </span>
            </div>
          </>
        ) : (
          <EmptyState
            title={t("news.empty")}
            description={searchInput ? t("news.try_other") : t("news.no_articles")}
            icon={<Newspaper size={20} className="text-text-2" />}
          />
        )}
      </div>
    </PageTransition>
  );
}

export default function NewsPage() {
  return (
    <Suspense>
      <NewsContent />
    </Suspense>
  );
}
