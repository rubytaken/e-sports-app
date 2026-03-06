import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./client";
import type { Videogame } from "./types";
import { STALE_TIMES } from "../constants";

export function useVideogames() {
  return useQuery<Videogame[]>({
    queryKey: ["videogames"],
    queryFn: () => apiGet<Videogame[]>("/videogames"),
    staleTime: STALE_TIMES.videogames,
  });
}
