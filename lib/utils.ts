import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Match } from "./api/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string | null): string {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeUntil(dateString: string): string {
  const now = new Date().getTime();
  const target = new Date(dateString).getTime();
  const diff = target - now;

  if (diff <= 0) return "Now";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function parseTimestamp(dateString: string | null | undefined): number {
  if (!dateString) return 0;
  const timestamp = new Date(dateString).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function getMatchSortTimestamp(match: Match): number {
  const dateCandidates =
    match.status === "finished"
      ? [match.end_at, match.scheduled_at, match.begin_at, match.original_scheduled_at, match.modified_at]
      : match.status === "canceled"
        ? [match.scheduled_at, match.original_scheduled_at, match.begin_at, match.end_at, match.modified_at]
        : [match.scheduled_at, match.begin_at, match.original_scheduled_at, match.end_at, match.modified_at];

  for (const value of dateCandidates) {
    const timestamp = parseTimestamp(value);
    if (timestamp > 0) return timestamp;
  }

  return 0;
}

export function sortMatchesByRecency(matches: Match[] | undefined): Match[] {
  if (!matches?.length) return [];

  return [...matches].sort((a, b) => {
    const timeDiff = getMatchSortTimestamp(b) - getMatchSortTimestamp(a);
    if (timeDiff !== 0) return timeDiff;

    const modifiedDiff = parseTimestamp(b.modified_at) - parseTimestamp(a.modified_at);
    if (modifiedDiff !== 0) return modifiedDiff;

    return b.id - a.id;
  });
}

export function getMatchScore(match: {
  results?: Array<{ team_id: number; score: number }>;
}): { home: number; away: number } {
  if (!match.results || match.results.length < 2) {
    return { home: 0, away: 0 };
  }
  return {
    home: match.results[0]?.score ?? 0,
    away: match.results[1]?.score ?? 0,
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function getVideogameIcon(slug: string): string {
  const icons: Record<string, string> = {
    "league-of-legends": "LoL",
    "cs-go": "CS2",
    "counter-strike-2": "CS2",
    dota2: "DotA",
    "dota-2": "DotA",
    valorant: "VAL",
    overwatch: "OW",
    "rocket-league": "RL",
    "r6-siege": "R6S",
    codmw: "CoD",
    pubg: "PUBG",
    "starcraft-2": "SC2",
    "king-of-glory": "KoG",
    fifa: "FC",
    "ea-sports-fc": "FC",
  };
  return icons[slug] || slug.substring(0, 3).toUpperCase();
}
