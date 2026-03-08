import { useQuery } from "@tanstack/react-query";
import { apiGet, apiGetPaginated, type PaginatedResponse } from "./client";
import type {
  Tournament,
  TournamentStanding,
  BracketMatch,
  TournamentRosterItem,
  Team,
  Match,
  QueryParams,
} from "./types";
import { STALE_TIMES, PAGE_SIZES } from "../constants";
import { gamePath } from "./game-slugs";

export function useTournaments(params?: QueryParams) {
  return useQuery<Tournament[]>({
    queryKey: ["tournaments", params],
    queryFn: () =>
      apiGet<Tournament[]>("/tournaments", {
        "page[size]": PAGE_SIZES.tournaments,
        sort: "-begin_at",
        ...params,
      }),
    staleTime: STALE_TIMES.tournaments,
  });
}

export function useTournamentsRunning(gameSlug?: string, params?: QueryParams) {
  return useQuery<PaginatedResponse<Tournament>>({
    queryKey: ["tournaments", "running", gameSlug, params],
    queryFn: () =>
      apiGetPaginated<Tournament>(`${gamePath(gameSlug)}/tournaments/running`, {
        "page[size]": 50,
        ...params,
      }),
    staleTime: STALE_TIMES.tournaments,
  });
}

export function useTournamentsPast(gameSlug?: string, params?: QueryParams) {
  return useQuery<PaginatedResponse<Tournament>>({
    queryKey: ["tournaments", "past", gameSlug, params],
    queryFn: () =>
      apiGetPaginated<Tournament>(`${gamePath(gameSlug)}/tournaments/past`, {
        "page[size]": 50,
        sort: "-end_at",
        ...params,
      }),
    staleTime: STALE_TIMES.tournaments,
  });
}

export function useTournamentsUpcoming(gameSlug?: string, params?: QueryParams) {
  return useQuery<PaginatedResponse<Tournament>>({
    queryKey: ["tournaments", "upcoming", gameSlug, params],
    queryFn: () =>
      apiGetPaginated<Tournament>(`${gamePath(gameSlug)}/tournaments/upcoming`, {
        "page[size]": 50,
        sort: "begin_at",
        ...params,
      }),
    staleTime: STALE_TIMES.tournaments,
  });
}

export function useTournamentsPaginated(
  type: "running" | "upcoming" | "past",
  page: number,
  pageSize: number,
  gameSlug?: string,
  params?: QueryParams,
) {
  const endpoints = {
    running: "/tournaments/running",
    upcoming: "/tournaments/upcoming",
    past: "/tournaments/past",
  };
  const sorts = {
    running: "-begin_at",
    upcoming: "begin_at",
    past: "-end_at",
  };

  return useQuery<PaginatedResponse<Tournament>>({
    queryKey: ["tournaments", type, "paginated", page, pageSize, gameSlug, params],
    queryFn: () =>
      apiGetPaginated<Tournament>(`${gamePath(gameSlug)}${endpoints[type]}`, {
        "page[number]": page,
        "page[size]": pageSize,
        sort: sorts[type],
        ...params,
      }),
    staleTime: STALE_TIMES.tournaments,
  });
}

export function useTournament(idOrSlug: string | number) {
  return useQuery<Tournament>({
    queryKey: ["tournament", idOrSlug],
    queryFn: () => apiGet<Tournament>(`/tournaments/${idOrSlug}`),
    staleTime: STALE_TIMES.tournamentDetail,
    enabled: !!idOrSlug,
  });
}

export function useTournamentStandings(idOrSlug: string | number) {
  return useQuery<TournamentStanding[]>({
    queryKey: ["tournament", idOrSlug, "standings"],
    queryFn: () =>
      apiGet<TournamentStanding[]>(`/tournaments/${idOrSlug}/standings`),
    staleTime: STALE_TIMES.standings,
    enabled: !!idOrSlug,
  });
}

export function useTournamentBrackets(idOrSlug: string | number, enabled = true) {
  return useQuery<BracketMatch[]>({
    queryKey: ["tournament", idOrSlug, "brackets"],
    queryFn: () =>
      apiGet<BracketMatch[]>(`/tournaments/${idOrSlug}/brackets`, {
        "page[size]": 100,
      }),
    staleTime: STALE_TIMES.tournamentDetail,
    enabled: !!idOrSlug && enabled,
  });
}

export function useTournamentRosters(idOrSlug: string | number) {
  return useQuery<TournamentRosterItem[]>({
    queryKey: ["tournament", idOrSlug, "rosters"],
    queryFn: () =>
      apiGet<TournamentRosterItem[]>(`/tournaments/${idOrSlug}/rosters`),
    staleTime: STALE_TIMES.tournamentDetail,
    enabled: !!idOrSlug,
  });
}

export function useTournamentTeams(idOrSlug: string | number) {
  return useQuery<Team[]>({
    queryKey: ["tournament", idOrSlug, "teams"],
    queryFn: () =>
      apiGet<Team[]>(`/tournaments/${idOrSlug}/teams`),
    staleTime: STALE_TIMES.tournamentDetail,
    enabled: !!idOrSlug,
  });
}

export function useTournamentMatches(idOrSlug: string | number, params?: QueryParams) {
  return useQuery<Match[]>({
    queryKey: ["tournament", idOrSlug, "matches", params],
    queryFn: () =>
      apiGet<Match[]>(`/tournaments/${idOrSlug}/matches`, {
        "page[size]": 100,
        sort: "begin_at",
        ...params,
      }),
    staleTime: STALE_TIMES.tournaments,
    enabled: !!idOrSlug,
  });
}
