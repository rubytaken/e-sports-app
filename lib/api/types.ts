// ============================================
// PandaScore API Type Definitions
// Based on: https://developers.pandascore.co/reference
// ============================================

export interface Videogame {
  id: number;
  name: string;
  slug: string;
  current_version: string | null;
}

export interface League {
  id: number;
  name: string;
  slug: string;
  url: string | null;
  image_url: string | null;
  videogame: Videogame;
  modified_at: string;
}

export interface Serie {
  id: number;
  name: string | null;
  slug: string;
  full_name: string;
  begin_at: string | null;
  end_at: string | null;
  league_id: number;
  league: League;
  season: string | null;
  tier: TierType | null;
  winner_id: number | null;
  winner_type: string | null;
  year: number | null;
  videogame: Videogame;
  modified_at: string;
}

export type TierType = "s" | "a" | "b" | "c" | "d" | "unranked";

export interface Tournament {
  id: number;
  name: string;
  slug: string;
  begin_at: string | null;
  end_at: string | null;
  has_bracket: boolean;
  league: League;
  league_id: number;
  live_supported: boolean;
  modified_at: string;
  prizepool: string | null;
  serie: Serie;
  serie_id: number;
  tier: TierType | null;
  videogame: Videogame;
  winner_id: number | null;
  winner_type: string | null;
  expected_roster?: TournamentRosterItem[];
  teams?: Team[];
}

export interface TournamentRosterItem {
  players: Player[];
  team: Team;
}

export interface TournamentStanding {
  rank: number;
  team?: Team;
  player?: Player;
  wins: number;
  losses: number;
  draws: number;
  total: number;
  last_match?: Match;
}

export interface BracketMatch extends Match {
  previous_matches: Array<{
    match_id: number;
    type: "winner" | "loser";
  }>;
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  acronym: string | null;
  image_url: string | null;
  location: string | null;
  current_videogame: Videogame | null;
  players?: Player[];
  modified_at: string;
}

export interface Player {
  id: number;
  name: string;
  slug: string;
  first_name: string | null;
  last_name: string | null;
  nationality: string | null;
  role: string | null;
  age: number | null;
  birthday: string | null;
  image_url: string | null;
  current_team: Team | null;
  current_videogame: Videogame | null;
  modified_at: string;
}

export interface Opponent {
  type: "Team" | "Player";
  opponent: Team | Player;
}

export interface MatchResult {
  team_id: number;
  score: number;
}

export interface StreamInfo {
  main: boolean;
  raw_url: string;
  language: string;
  official: boolean;
  embed_url: string | null;
}

export type MatchStatus =
  | "not_started"
  | "running"
  | "finished"
  | "canceled"
  | "postponed";

export interface Match {
  id: number;
  name: string;
  slug: string;
  status: MatchStatus;
  match_type: string;
  number_of_games: number;
  scheduled_at: string | null;
  original_scheduled_at: string | null;
  begin_at: string | null;
  end_at: string | null;
  detailed_stats: boolean;
  draw: boolean;
  forfeit: boolean;
  rescheduled: boolean;
  league: League;
  league_id: number;
  serie: Serie;
  serie_id: number;
  tournament: Tournament;
  tournament_id: number;
  winner: Team | Player | null;
  winner_id: number | null;
  winner_type: string | null;
  opponents: Opponent[];
  results: MatchResult[];
  games: Game[];
  streams_list: StreamInfo[];
  live_embed_url: string | null;
  videogame: Videogame;
  modified_at: string;
}

export interface Game {
  id: number;
  begin_at: string | null;
  end_at: string | null;
  complete: boolean;
  finished: boolean;
  forfeit: boolean;
  length: number | null;
  match_id: number;
  position: number;
  status: string;
  winner: { id: number; type: string } | null;
  winner_type: string | null;
  detailed_stats: boolean;
}

export interface LiveMatch {
  endpoints: Array<{
    begin_at: string | null;
    expected_begin_at: string | null;
    last_active: string | null;
    match_id: number;
    open: boolean;
    type: "frames" | "events";
    url: string;
  }>;
  match: Match;
}

// API Query Parameters
export interface PaginationParams {
  "page[number]"?: number;
  "page[size]"?: number;
}

export interface FilterParams {
  "filter[tier]"?: string;
  "filter[status]"?: string;
  "filter[id]"?: string;
}

export interface SortParams {
  sort?: string;
}

export interface SearchParams {
  "search[name]"?: string;
}

export type QueryParams = PaginationParams &
  FilterParams &
  SortParams &
  SearchParams;
