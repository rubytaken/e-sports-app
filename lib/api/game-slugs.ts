// PandaScore API uses different slugs for videogame resources vs endpoint paths.
// e.g. /videogames returns slug "cs-go" but game-specific endpoints use "csgo".

const ENDPOINT_SLUGS: Record<string, string> = {
  "cs-go": "csgo",
  "league-of-legends": "lol",
  "dota-2": "dota2",
  "r6-siege": "r6siege",
  "cod-mw": "codmw",
};

export function toEndpointSlug(videogameSlug: string): string {
  return ENDPOINT_SLUGS[videogameSlug] ?? videogameSlug;
}

export function gamePath(slug?: string): string {
  return slug ? `/${toEndpointSlug(slug)}` : "";
}
