import { useQuery } from "@tanstack/react-query";

// ── Types ──────────────────────────────────────────────

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
  error?: string;
}

// ── Fetch function ─────────────────────────────────────

async function fetchNews(params: {
  q?: string;
  page?: number;
  pageSize?: number;
  language?: string;
  sortBy?: string;
}): Promise<NewsApiResponse> {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params.language) searchParams.set("language", params.language);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);

  const qs = searchParams.toString();
  const url = `/api/news${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `News API request failed: ${res.status}`);
  }

  return res.json();
}

// ── Hooks ──────────────────────────────────────────────

const PAGE_SIZE = 12;

/** Mapping from app locale to NewsAPI language code */
const localeToLang: Record<string, string> = {
  en: "en",
  tr: "tr",
  de: "de",
  es: "es",
  fr: "fr",
};

export function useEsportsNews(
  page: number = 1,
  search?: string,
  locale: string = "en"
) {
  const language = localeToLang[locale] || "en";

  return useQuery({
    queryKey: ["esports-news", page, search || "esports", language],
    queryFn: () =>
      fetchNews({
        q: search || "esports",
        page,
        pageSize: PAGE_SIZE,
        language,
        sortBy: "publishedAt",
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (prev) => prev,
  });
}

// ── Helpers ────────────────────────────────────────────

export function formatNewsDate(dateString: string, locale: string = "en"): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return locale === "tr" ? `${diffMins} dk once` :
           locale === "de" ? `vor ${diffMins} Min.` :
           locale === "es" ? `hace ${diffMins} min` :
           locale === "fr" ? `il y a ${diffMins} min` :
           `${diffMins}m ago`;
  }

  if (diffHours < 24) {
    return locale === "tr" ? `${diffHours} saat once` :
           locale === "de" ? `vor ${diffHours} Std.` :
           locale === "es" ? `hace ${diffHours}h` :
           locale === "fr" ? `il y a ${diffHours}h` :
           `${diffHours}h ago`;
  }

  if (diffDays < 7) {
    return locale === "tr" ? `${diffDays} gun once` :
           locale === "de" ? `vor ${diffDays} Tagen` :
           locale === "es" ? `hace ${diffDays}d` :
           locale === "fr" ? `il y a ${diffDays}j` :
           `${diffDays}d ago`;
  }

  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
