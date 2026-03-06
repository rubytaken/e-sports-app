"use client";

import { ExternalLink } from "lucide-react";
import type { NewsArticle } from "@/lib/api/news";
import { formatNewsDate } from "@/lib/api/news";

interface NewsCardProps {
  article: NewsArticle;
  locale?: string;
}

export function NewsCard({ article, locale = "en" }: NewsCardProps) {
  const hasImage = article.urlToImage && !article.urlToImage.includes("removed");

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface-1 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 h-full"
    >
      {/* Image — fixed height */}
      <div className="relative h-40 overflow-hidden bg-surface-2 shrink-0">
        {hasImage ? (
          <>
            <img
              src={article.urlToImage!}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-2xl font-bold text-text-2/30 uppercase tracking-widest">
              {article.source.name}
            </span>
          </div>
        )}
      </div>

      {/* Content — flex-1 fills remaining space */}
      <div className="flex flex-1 flex-col p-4">
        {/* Source & Date */}
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wide truncate max-w-[50%]">
            {article.source.name}
          </span>
          <span className="text-[10px] text-text-2 shrink-0">
            {formatNewsDate(article.publishedAt, locale)}
          </span>
        </div>

        {/* Title — always 2 lines */}
        <h3 className="text-sm font-semibold text-text-0 leading-snug group-hover:text-accent transition-colors line-clamp-2">
          {cleanTitle(article.title)}
        </h3>

        {/* Description — always 2 lines */}
        <p className="mt-2 text-xs text-text-2 leading-relaxed line-clamp-2">
          {article.description || ""}
        </p>

        {/* Spacer pushes footer to bottom */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/50">
          {article.author ? (
            <span className="text-[10px] text-text-2 truncate max-w-[70%]">
              {article.author}
            </span>
          ) : (
            <span />
          )}
          <span className="ml-auto flex items-center gap-1 text-[10px] text-text-2 group-hover:text-accent transition-colors">
            <ExternalLink size={10} />
          </span>
        </div>
      </div>
    </a>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-1 h-full">
      <div className="h-40 bg-surface-2 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 rounded bg-surface-2 animate-pulse" />
          <div className="h-3 w-12 rounded bg-surface-2 animate-pulse" />
        </div>
        <div className="h-4 w-4/5 rounded bg-surface-2 animate-pulse" />
        <div className="h-4 w-3/5 rounded bg-surface-2 animate-pulse" />
        <div className="h-3 w-full rounded bg-surface-2 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-surface-2 animate-pulse" />
      </div>
    </div>
  );
}

/** Remove "- SourceName" suffix that NewsAPI often appends to titles */
function cleanTitle(title: string): string {
  const dashIdx = title.lastIndexOf(" - ");
  if (dashIdx > 20) {
    return title.slice(0, dashIdx);
  }
  return title;
}
