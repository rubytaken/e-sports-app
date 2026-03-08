import { useQuery } from "@tanstack/react-query";
import { apiGet, apiGetPaginated, type PaginatedResponse } from "./client";
import type { Match, LiveMatch, QueryParams } from "./types";
import { STALE_TIMES, REFETCH_INTERVALS } from "../constants";
import { gamePath } from "./game-slugs";

export function useMatchesRunning(gameSlug?: string, params?: QueryParams) {
  return useQuery<PaginatedResponse<Match>>({
    queryKey: ["matches", "running", gameSlug, params],
    queryFn: () =>
      apiGetPaginated<Match>(`${gamePath(gameSlug)}/matches/running`, {
        "page[size]": 50,
        sort: "begin_at",
        ...params,
      }),
    staleTime: STALE_TIMES.matchesLive,
    refetchInterval: REFETCH_INTERVALS.matchesLive,
  });
}

export function useMatchesUpcoming(gameSlug?: string, params?: QueryParams) {
  return useQuery<PaginatedResponse<Match>>({
    queryKey: ["matches", "upcoming", gameSlug, params],
    queryFn: () =>
      apiGetPaginated<Match>(`${gamePath(gameSlug)}/matches/upcoming`, {
        "page[size]": 50,
        sort: "begin_at",
        ...params,
      }),
    staleTime: STALE_TIMES.matchesUpcoming,
    refetchInterval: REFETCH_INTERVALS.matchesUpcoming,
  });
}

export function useMatchesPast(gameSlug?: string, params?: QueryParams) {
  return useQuery<PaginatedResponse<Match>>({
    queryKey: ["matches", "past", gameSlug, params],
    queryFn: () =>
      apiGetPaginated<Match>(`${gamePath(gameSlug)}/matches/past`, {
        "page[size]": 50,
        sort: "-end_at",
        "filter[status]": params?.["filter[status]"] ?? "finished",
        ...params,
      }),
    staleTime: STALE_TIMES.matchesPast,
  });
}

export function useMatchesPaginated(
  type: "running" | "upcoming" | "past",
  page: number,
  pageSize: number,
  gameSlug?: string,
  params?: QueryParams,
) {
  const endpoints = {
    running: "/matches/running",
    upcoming: "/matches/upcoming",
    past: "/matches/past",
  };
  const sorts = {
    running: "begin_at",
    upcoming: "begin_at",
    past: "-end_at",
  };

  return useQuery<PaginatedResponse<Match>>({
    queryKey: ["matches", type, "paginated", page, pageSize, gameSlug, params],
    queryFn: () =>
      apiGetPaginated<Match>(`${gamePath(gameSlug)}${endpoints[type]}`, {
        "page[number]": page,
        "page[size]": pageSize,
        sort: sorts[type],
        ...params,
      }),
    staleTime: type === "running" ? STALE_TIMES.matchesLive : STALE_TIMES.matchesUpcoming,
    refetchInterval: type === "running" ? REFETCH_INTERVALS.matchesLive : undefined,
  });
}

export function useMatch(idOrSlug: string | number) {
  return useQuery<Match>({
    queryKey: ["match", idOrSlug],
    queryFn: () => apiGet<Match>(`/matches/${idOrSlug}`),
    staleTime: STALE_TIMES.matchesUpcoming,
    enabled: !!idOrSlug,
  });
}

export function useMatchOpponents(idOrSlug: string | number) {
  return useQuery({
    queryKey: ["match", idOrSlug, "opponents"],
    queryFn: () => apiGet(`/matches/${idOrSlug}/opponents`),
    staleTime: STALE_TIMES.matchesUpcoming,
    enabled: !!idOrSlug,
  });
}

export function useLiveMatches() {
  return useQuery<LiveMatch[]>({
    queryKey: ["lives"],
    queryFn: () => apiGet<LiveMatch[]>("/lives"),
    staleTime: STALE_TIMES.matchesLive,
    refetchInterval: REFETCH_INTERVALS.matchesLive,
  });
}
