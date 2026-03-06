import { useQuery } from "@tanstack/react-query";
import { apiGet, apiGetPaginated, type PaginatedResponse } from "./client";
import type { Player, League, Match, Serie, Tournament, QueryParams } from "./types";
import { STALE_TIMES, PAGE_SIZES } from "../constants";
import { gamePath } from "./game-slugs";

export function usePlayers(params?: QueryParams) {
  return useQuery<Player[]>({
    queryKey: ["players", params],
    queryFn: () =>
      apiGet<Player[]>("/players", {
        "page[size]": PAGE_SIZES.players,
        ...params,
      }),
    staleTime: STALE_TIMES.playerDetail,
  });
}

export function usePlayersPaginated(page: number, pageSize: number, gameSlug?: string, params?: QueryParams) {
  return useQuery<PaginatedResponse<Player>>({
    queryKey: ["players", "paginated", page, pageSize, gameSlug, params],
    queryFn: () =>
      apiGetPaginated<Player>(`${gamePath(gameSlug)}/players`, {
        "page[number]": page,
        "page[size]": pageSize,
        sort: "-modified_at",
        ...params,
      }),
    staleTime: STALE_TIMES.playerDetail,
  });
}

export function usePlayer(idOrSlug: string | number) {
  return useQuery<Player>({
    queryKey: ["player", idOrSlug],
    queryFn: () => apiGet<Player>(`/players/${idOrSlug}`),
    staleTime: STALE_TIMES.playerDetail,
    enabled: !!idOrSlug,
  });
}

export function usePlayerLeagues(idOrSlug: string | number) {
  return useQuery<League[]>({
    queryKey: ["player", idOrSlug, "leagues"],
    queryFn: () => apiGet<League[]>(`/players/${idOrSlug}/leagues`),
    staleTime: STALE_TIMES.playerDetail,
    enabled: !!idOrSlug,
  });
}

export function usePlayerMatches(idOrSlug: string | number, params?: QueryParams) {
  return useQuery<Match[]>({
    queryKey: ["player", idOrSlug, "matches", params],
    queryFn: () =>
      apiGet<Match[]>(`/players/${idOrSlug}/matches`, {
        "page[size]": 50,
        sort: "-begin_at",
        ...params,
      }),
    staleTime: STALE_TIMES.playerDetail,
    enabled: !!idOrSlug,
  });
}

export function usePlayerSeries(idOrSlug: string | number) {
  return useQuery<Serie[]>({
    queryKey: ["player", idOrSlug, "series"],
    queryFn: () =>
      apiGet<Serie[]>(`/players/${idOrSlug}/series`, {
        "page[size]": 50,
        sort: "-begin_at",
      }),
    staleTime: STALE_TIMES.playerDetail,
    enabled: !!idOrSlug,
  });
}

export function usePlayerTournaments(idOrSlug: string | number) {
  return useQuery<Tournament[]>({
    queryKey: ["player", idOrSlug, "tournaments"],
    queryFn: () =>
      apiGet<Tournament[]>(`/players/${idOrSlug}/tournaments`, {
        "page[size]": 50,
        sort: "-begin_at",
      }),
    staleTime: STALE_TIMES.playerDetail,
    enabled: !!idOrSlug,
  });
}
