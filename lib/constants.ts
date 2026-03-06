export const PANDASCORE_API_URL = "https://api.pandascore.co";

export const STALE_TIMES = {
  videogames: 1000 * 60 * 60,       // 1 hour
  tournaments: 1000 * 60 * 2,       // 2 minutes
  tournamentDetail: 1000 * 60 * 2,  // 2 minutes
  matchesLive: 1000 * 15,           // 15 seconds
  matchesUpcoming: 1000 * 60,       // 1 minute
  matchesPast: 1000 * 60 * 5,       // 5 minutes
  teamDetail: 1000 * 60 * 5,        // 5 minutes
  playerDetail: 1000 * 60 * 5,      // 5 minutes
  standings: 1000 * 60 * 2,         // 2 minutes
} as const;

export const REFETCH_INTERVALS = {
  matchesLive: 1000 * 15,      // 15 seconds
  matchesUpcoming: 1000 * 60,  // 1 minute
} as const;

export const PAGE_SIZES = {
  default: 12,
  matches: 10,
  tournaments: 12,
  teams: 12,
  players: 12,
} as const;

export const TIER_CONFIG = {
  s: { label: "S", color: "bg-tier-s text-bg-primary", description: "Premier" },
  a: { label: "A", color: "bg-tier-a text-bg-primary", description: "Major" },
  b: { label: "B", color: "bg-tier-b text-text-primary", description: "Mid-tier" },
  c: { label: "C", color: "bg-tier-c text-text-primary", description: "Minor" },
  d: { label: "D", color: "bg-tier-d text-text-secondary", description: "Qualifier" },
  unranked: { label: "?", color: "bg-bg-hover text-text-muted", description: "Unranked" },
} as const;

export const MATCH_STATUS = {
  not_started: { label: "Upcoming", color: "text-status-upcoming" },
  running: { label: "LIVE", color: "text-status-live" },
  finished: { label: "Finished", color: "text-status-finished" },
  canceled: { label: "Canceled", color: "text-text-muted" },
  postponed: { label: "Postponed", color: "text-text-muted" },
} as const;
