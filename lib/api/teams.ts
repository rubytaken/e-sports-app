import { useQuery } from "@tanstack/react-query";
import { apiGet, apiGetPaginated, type PaginatedResponse } from "./client";
import type { Team, League, Match, Serie, Tournament, QueryParams } from "./types";
import { STALE_TIMES, PAGE_SIZES } from "../constants";
import { gamePath } from "./game-slugs";

export function useTeams(params?: QueryParams) {
  return useQuery<Team[]>({
    queryKey: ["teams", params],
    queryFn: () =>
      apiGet<Team[]>("/teams", {
        "page[size]": PAGE_SIZES.teams,
        ...params,
      }),
    staleTime: STALE_TIMES.teamDetail,
  });
}

export function useTeamsPaginated(page: number, pageSize: number, gameSlug?: string, params?: QueryParams) {
  return useQuery<PaginatedResponse<Team>>({
    queryKey: ["teams", "paginated", page, pageSize, gameSlug, params],
    queryFn: () =>
      apiGetPaginated<Team>(`${gamePath(gameSlug)}/teams`, {
        "page[number]": page,
        "page[size]": pageSize,
        sort: "-modified_at",
        ...params,
      }),
    staleTime: STALE_TIMES.teamDetail,
  });
}

export function useTeam(idOrSlug: string | number) {
  return useQuery<Team>({
    queryKey: ["team", idOrSlug],
    queryFn: () => apiGet<Team>(`/teams/${idOrSlug}`),
    staleTime: STALE_TIMES.teamDetail,
    enabled: !!idOrSlug,
  });
}

export function useTeamLeagues(idOrSlug: string | number) {
  return useQuery<League[]>({
    queryKey: ["team", idOrSlug, "leagues"],
    queryFn: () => apiGet<League[]>(`/teams/${idOrSlug}/leagues`),
    staleTime: STALE_TIMES.teamDetail,
    enabled: !!idOrSlug,
  });
}

export function useTeamMatches(idOrSlug: string | number, params?: QueryParams) {
  return useQuery<Match[]>({
    queryKey: ["team", idOrSlug, "matches", params],
    queryFn: () =>
      apiGet<Match[]>(`/teams/${idOrSlug}/matches`, {
        "page[size]": 50,
        sort: "-begin_at",
        ...params,
      }),
    staleTime: STALE_TIMES.teamDetail,
    enabled: !!idOrSlug,
  });
}

export function useTeamSeries(idOrSlug: string | number) {
  return useQuery<Serie[]>({
    queryKey: ["team", idOrSlug, "series"],
    queryFn: () =>
      apiGet<Serie[]>(`/teams/${idOrSlug}/series`, {
        "page[size]": 50,
        sort: "-begin_at",
      }),
    staleTime: STALE_TIMES.teamDetail,
    enabled: !!idOrSlug,
  });
}

export function useTeamTournaments(idOrSlug: string | number) {
  return useQuery<Tournament[]>({
    queryKey: ["team", idOrSlug, "tournaments"],
    queryFn: () =>
      apiGet<Tournament[]>(`/teams/${idOrSlug}/tournaments`, {
        "page[size]": 50,
        sort: "-begin_at",
      }),
    staleTime: STALE_TIMES.teamDetail,
    enabled: !!idOrSlug,
  });
}
